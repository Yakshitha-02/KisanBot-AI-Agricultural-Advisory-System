from sqlalchemy.orm import Session

from app.models.conversation_session import ConversationSession


def create_chat_session(db: Session, user_id: int):

    session = ConversationSession(
        user_id=user_id,
        title="New Chat"
    )

    db.add(session)
    db.commit()
    db.refresh(session)

    return session


def delete_chat_session(
    db: Session,
    session_id: int,
    user_id: int,
):

    session = (
        db.query(ConversationSession)
        .filter(
            ConversationSession.id == session_id,
            ConversationSession.user_id == user_id,
        )
        .first()
    )

    if not session:
        return None

    db.delete(session)

    db.commit()

    return True


def rename_chat_session(
    db: Session,
    session_id: int,
    user_id: int,
    title: str,
):

    session = (
        db.query(ConversationSession)
        .filter(
            ConversationSession.id == session_id,
            ConversationSession.user_id == user_id,
        )
        .first()
    )

    if not session:
        return None

    session.title = title

    db.commit()

    db.refresh(session)

    return session