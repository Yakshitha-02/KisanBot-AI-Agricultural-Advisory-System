from sqlalchemy.orm import Session

from app.models.user import User
from app.models.conversation_session import ConversationSession
from app.models.message import Message
from app.models.feedback import Feedback

def dashboard_stats(db: Session):

    total_users = db.query(User).count()

    total_farmers = (
        db.query(User)
        .filter(User.role == "farmer")
        .count()
    )

    total_admins = (
        db.query(User)
        .filter(User.role == "admin")
        .count()
    )

    active_users = (
        db.query(User)
        .filter(User.is_active == True)
        .count()
    )

    inactive_users = (
        db.query(User)
        .filter(User.is_active == False)
        .count()
    )

    total_sessions = db.query(ConversationSession).count()

    total_messages = db.query(Message).count()

    total_feedback = db.query(Feedback).count()

    positive_feedback = (
        db.query(Feedback)
        .filter(Feedback.rating == "positive")
        .count()
    )

    negative_feedback = (
        db.query(Feedback)
        .filter(Feedback.rating == "negative")
        .count()
    )

    positive_percentage = (
        round((positive_feedback / total_feedback) * 100, 1)
        if total_feedback > 0
        else 0
    )

    negative_percentage = (
        round((negative_feedback / total_feedback) * 100, 1)
        if total_feedback > 0
        else 0
    )

    return {
        "total_users": total_users,
        "total_farmers": total_farmers,
        "total_admins": total_admins,
        "active_users": active_users,
        "inactive_users": inactive_users,
        "total_sessions": total_sessions,
        "total_messages": total_messages,
        "total_feedback": total_feedback,
        "positive_feedback": positive_feedback,
        "negative_feedback": negative_feedback,
        "positive_percentage": positive_percentage,
        "negative_percentage": negative_percentage,
    }


def get_all_users(db: Session):
    return (
        db.query(User)
        .order_by(User.id.desc())
        .all()
    )


def get_user(db: Session, user_id: int):
    return db.get(User, user_id)


def delete_user(db: Session, user_id: int):

    user = db.get(User, user_id)

    if user is None:
        return None

    db.delete(user)
    db.commit()

    return user


def toggle_user_status(db: Session, user_id: int):

    user = db.get(User, user_id)

    if user is None:
        return None

    user.is_active = not user.is_active

    db.commit()
    db.refresh(user)

    return user