from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session
from app.services.intent_classifier import classify_intent
from app.database.session import get_db
from app.services.ner import extract_entities
from app.models.user import User
from app.models.message import Message
from app.models.conversation_session import ConversationSession

from app.schemas.chat import AskRequest, FeedbackRequest
from app.schemas.session import SessionResponse
from fastapi import APIRouter, Depends, HTTPException, Request
from app.utils.sanitizer import sanitize_message
from app.middleware.rate_limit import limiter
import logging

from app.schemas.chat_session import RenameSessionRequest
from app.services.rag.chat import ask_rag
from app.services.chatbot import process_question
from app.services.chat_service import (
    create_chat_session,
    delete_chat_session,
    rename_chat_session,
)
from app.services.translator import (
    detect_language,
    translate_to_english,
    translate_from_english,
)

from app.utils.security import verify_access_token
from app.models.unanswered_query import UnansweredQuery

router = APIRouter()
security = HTTPBearer()
logger = logging.getLogger(__name__)


# -----------------------------
# Create New Chat Session
# -----------------------------
@router.post("/session", response_model=SessionResponse)
def create_session(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    token = verify_access_token(credentials.credentials)

    user = db.get(User, int(token["sub"]))

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    session = create_chat_session(db, user.id)

    return session


# -----------------------------
# Ask AI
# -----------------------------
@router.post("/ask")
@limiter.limit("20/minute")
def ask(
    request: Request,
    payload: AskRequest,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    try:
        # -----------------------------
        # Verify User
        # -----------------------------
        token = verify_access_token(credentials.credentials)

        user = db.get(User, int(token["sub"]))

        if user is None:
            raise HTTPException(
                status_code=404,
                detail="User not found",
            )

        # -----------------------------
        # Verify Session
        # -----------------------------
        session = (
            db.query(ConversationSession)
            .filter(
                ConversationSession.id == payload.session_id,
                ConversationSession.user_id == user.id,
            )
            .first()
        )

        if session is None:
            raise HTTPException(
                status_code=404,
                detail="Session not found",
            )

        # -----------------------------
        # Sanitize Question
        # -----------------------------
        print("Original question:", repr(payload.question))

        question = sanitize_message(payload.question)

        print("Sanitized question:", repr(question))

        logger.info(f"User {user.id} asked: {question}")

        # -----------------------------
        # Load Conversation History
        # -----------------------------
        history = (
            db.query(Message)
            .filter(Message.session_id == session.id)
            .order_by(Message.created_at.asc())
            .all()
        )

        print("\n===== HISTORY =====")
        for msg in history:
            print(f"{msg.sender}: {msg.message}")
        print("===================\n")

        # -----------------------------
        # Process Question
        # -----------------------------
        response = process_question(
            question=question,
            history=history,
        )

        print("===== PROCESS QUESTION RESPONSE =====")
        print(response)
        print(type(response))
        print("====================================")
        
        language = response["language"]
        print("Language variable =", language)
        final_answer = response["answer"]
        confidence = response.get("confidence")
        score = response.get("score")

        # Save low-confidence questions for admin review
        if confidence and str(confidence).lower() == "low":
            unanswered = UnansweredQuery(
                user_id=user.id,
                question=question,
                confidence=0.0,
            )
            db.add(unanswered)

        # -----------------------------
        # Save User Message
        # -----------------------------
        print("About to save user message")
        db.add(
            Message(
                session_id=session.id,
                sender="user",
                message=question,
                language=language,
            )
        )

        # -----------------------------
        # Save Assistant Message
        # -----------------------------

        assistant_message = Message(
         session_id=session.id,
         sender="assistant",
         message=final_answer,
         language=language,
         )

        db.add(assistant_message)

        # -----------------------------
        # Update Session Title
        # -----------------------------
        if session.title == "New Chat":
            session.title = question[:40]

        db.commit()
        db.refresh(assistant_message)

        return {
         "session_id": session.id,
         "message_id": assistant_message.id,
         "language": language,
         "answer": final_answer,
         "confidence": confidence,
         "score": score,
        }

    except HTTPException:
        db.rollback()
        raise

    except Exception as e:
        db.rollback()
        logger.exception(e)

        raise HTTPException(
            status_code=500,
            detail="Internal Server Error",
        )

@router.get("/session/{session_id}")
def get_messages(
    session_id: int,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    token = verify_access_token(credentials.credentials)

    user = db.get(User, int(token["sub"]))

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    session = (
        db.query(ConversationSession)
        .filter(
            ConversationSession.id == session_id,
            ConversationSession.user_id == user.id,
        )
        .first()
    )

    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")

    return session.messages

# -----------------------------
# Delete Chat Session
# -----------------------------
@router.delete("/session/{session_id}")
def delete_session(
    session_id: int,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    token = verify_access_token(credentials.credentials)

    user = db.get(User, int(token["sub"]))

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    deleted = delete_chat_session(
        db,
        session_id,
        user.id,
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Session not found",
        )

    return {
        "message": "Chat deleted successfully."
    }

# -----------------------------
# Rename Chat Session
# -----------------------------
@router.patch("/session/{session_id}")
def rename_session(
    session_id: int,
    payload: RenameSessionRequest,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    token = verify_access_token(credentials.credentials)

    user = db.get(User, int(token["sub"]))

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    session = rename_chat_session(
        db,
        session_id,
        user.id,
        payload.title,
    )

    if session is None:
        raise HTTPException(
            status_code=404,
            detail="Session not found",
        )

    return session