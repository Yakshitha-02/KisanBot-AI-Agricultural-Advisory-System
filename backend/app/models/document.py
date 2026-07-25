from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime,
    ForeignKey,
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.base import Base


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String, nullable=False)

    filename = Column(String, nullable=False)

    filepath = Column(String, nullable=False)

    file_size = Column(Integer)

    pages = Column(Integer, default=0)

    language = Column(String, default="English")

    category = Column(String, default="General")

    status = Column(String, default="Uploaded")

    # True after embeddings are generated and stored
    is_indexed = Column(Boolean, default=False)

    # Comma-separated list of translated languages
    # Example: "Hindi,Telugu,Tamil"
    translated_languages = Column(String, default="")

    uploaded_by = Column(
        Integer,
        ForeignKey("users.id"),
    )

    uploaded_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    user = relationship("User")