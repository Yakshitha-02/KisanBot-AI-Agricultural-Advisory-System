from sqlalchemy.orm import Session, joinedload
from fastapi import APIRouter, Depends, HTTPException

from app.database.session import get_db
from app.models.feedback import Feedback
from app.schemas.feedback import (
    FeedbackCreate,
    FeedbackResponse,
    AdminFeedbackResponse,
)
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from app.utils.security import verify_access_token
from app.models.user import User

router = APIRouter()
security = HTTPBearer()

@router.post("/")
def submit_feedback(
    feedback: FeedbackCreate,
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

    new_feedback = Feedback(
        user_id=user.id,
        message_id=feedback.message_id,
        rating=feedback.rating,
        comment=feedback.comment,
    )

    db.add(new_feedback)
    db.commit()
    db.refresh(new_feedback)

    return {
        "message": "Feedback submitted successfully",
        "feedback_id": new_feedback.id,
    }

@router.get(
    "/my",
    response_model=list[FeedbackResponse],
)
def get_my_feedback(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    token = verify_access_token(credentials.credentials)

    user = db.get(User, int(token["sub"]))

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    feedbacks = (
        db.query(Feedback)
        .options(joinedload(Feedback.message))
        .filter(Feedback.user_id == user.id)
        .all()
    )

    return [
        FeedbackResponse(
            id=fb.id,
            message=fb.message.message,
            rating=fb.rating,
            comment=fb.comment,
            created_at=fb.created_at,
        )
        for fb in feedbacks
    ]

from sqlalchemy.orm import joinedload

@router.get(
    "/all",
    response_model=list[AdminFeedbackResponse],
)
def get_all_feedback(
    db: Session = Depends(get_db),
):
    feedbacks = (
        db.query(Feedback)
        .options(
            joinedload(Feedback.user),
            joinedload(Feedback.message),
        )
        .all()
    )

    result = []

    for fb in feedbacks:

        if fb.message is None:
            continue

        result.append(
            AdminFeedbackResponse(
                id=fb.id,
                farmer_name=fb.user.full_name,
                farmer_email=fb.user.email,
                message=fb.message.message,
                rating=fb.rating,
                comment=fb.comment,
                created_at=fb.created_at,
            )
        )

    return result