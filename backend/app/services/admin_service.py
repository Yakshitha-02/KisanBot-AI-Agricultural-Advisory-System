from sqlalchemy.orm import Session

from app.models.user import User
from app.models.conversation_session import ConversationSession
from app.models.message import Message


def dashboard_stats(db: Session):

    return {
        "total_users": db.query(User).count(),

        "total_farmers":
        db.query(User)
        .filter(User.role == "farmer")
        .count(),

        "total_admins":
        db.query(User)
        .filter(User.role == "admin")
        .count(),

        "total_sessions":
        db.query(ConversationSession)
        .count(),

        "total_messages":
        db.query(Message)
        .count(),
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