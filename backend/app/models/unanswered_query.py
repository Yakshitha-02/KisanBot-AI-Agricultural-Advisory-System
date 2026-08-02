from sqlalchemy import (
    Column,
    Integer,
    Text,
    Float,
    Boolean,
    ForeignKey,
    DateTime,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.base import Base


class UnansweredQuery(Base):
    __tablename__ = "unanswered_queries"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    question = Column(
        Text,
        nullable=False,
    )

    confidence = Column(
        Float,
        default=0,
    )

    resolved = Column(
        Boolean,
        default=False,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    user = relationship("User")