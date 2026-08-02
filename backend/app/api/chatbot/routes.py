from fastapi import APIRouter, Depends, HTTPException
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
def ask(
    request: AskRequest,
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
            ConversationSession.id == request.session_id,
            ConversationSession.user_id == user.id,
        )
        .first()
    )

    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")

    response = process_question(request.question)

    language = response["language"]
    final_answer = response["answer"]

    confidence = response.get("confidence")
    score = response.get("score")

    # Save low-confidence questions for admin review
    if confidence is not None:

     if confidence.lower() == "low":

        unanswered = UnansweredQuery(
            user_id=user.id,
            question=request.question,
            confidence=0.0,
        )

        db.add(unanswered)
    # Save user message
    user_message = Message(
        session_id=session.id,
        sender="user",
        message=request.question,
        language=language,
    )

    db.add(user_message)

    # Save assistant message
    assistant_message = Message(
        session_id=session.id,
        sender="assistant",
        message=final_answer,
        language=language,
    )

    db.add(assistant_message)

    # Rename session after first question
    if session.title == "New Chat":
        session.title = request.question[:40]

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

@router.post("/intent")
def detect_intent(request: AskRequest):
    intent = classify_intent(request.question)

    return {
        "question": request.question,
        "intent": intent,
    }
@router.post("/ner")
def detect_entities(request: AskRequest):
    entities = extract_entities(request.question)

    return {
        "question": request.question,
        "entities": entities,
    }
# -----------------------------
# List User Sessions
# -----------------------------
@router.get("/sessions")
def get_sessions(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    token = verify_access_token(credentials.credentials)

    user = db.get(User, int(token["sub"]))

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    sessions = (
        db.query(ConversationSession)
        .filter(ConversationSession.user_id == user.id)
        .order_by(ConversationSession.updated_at.desc())
        .all()
    )

    return sessions


# -----------------------------
# Get Messages of a Session
# -----------------------------
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
            detail="User not found"
        )

    deleted = delete_chat_session(
        db,
        session_id,
        user.id,
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
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
            detail="User not found"
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
            detail="Session not found"
        )

    return session