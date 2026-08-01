from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    email = Column(
        String,
        unique=True,
        nullable=False,
        index=True,
    )

    hashed_password = Column(
        String,
        nullable=False,
    )

    role = Column(
        String,
        nullable=False,
    )

    is_active = Column(
        Boolean,
        default=True,
    )

    full_name = Column(String)

    # ----------------------------
    # User Preferences
    # ----------------------------

    preferred_language = Column(
        String,
        default="English",
    )

    state = Column(String)

    district = Column(String)

    preferred_crop = Column(String)

    voice_enabled = Column(
        Boolean,
        default=False,
    )

    dark_mode = Column(
        Boolean,
        default=False,
    )

    # ----------------------------
    # Metadata
    # ----------------------------

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    # ----------------------------
    # Relationships
    # ----------------------------

    conversation_sessions = relationship(
        "ConversationSession",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    feedbacks = relationship(
        "Feedback",
        back_populates="user",
        cascade="all, delete-orphan",
)