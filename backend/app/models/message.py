from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.base import Base


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)

    session_id = Column(
        Integer,
        ForeignKey("conversation_sessions.id"),
        nullable=False
    )

    sender = Column(String, nullable=False)

    message = Column(Text, nullable=False)

    language = Column(String, default="English")

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    session = relationship(
        "ConversationSession",
        back_populates="messages"
    )
    feedbacks = relationship(
        "Feedback",
        back_populates="message",
        cascade="all, delete-orphan",
    )