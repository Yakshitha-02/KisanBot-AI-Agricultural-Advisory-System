from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload

from app.database.session import get_db
from app.models.feedback import Feedback
from app.schemas.feedback import (
    FeedbackCreate,
    FeedbackResponse,
    AdminFeedbackResponse,
)

router = APIRouter()


@router.post("/")
def submit_feedback(
    feedback: FeedbackCreate,
    db: Session = Depends(get_db),
):
    new_feedback = Feedback(
        user_id=1,      # Temporary
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
    db: Session = Depends(get_db),
):
    user_id = 1

    feedbacks = (
        db.query(Feedback)
        .options(joinedload(Feedback.message))
        .filter(Feedback.user_id == user_id)
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