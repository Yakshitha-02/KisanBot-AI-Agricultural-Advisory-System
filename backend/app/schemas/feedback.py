<<<<<<< HEAD
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, field_validator


class FeedbackCreate(BaseModel):
    message_id: int
    rating: str
    comment: Optional[str] = None

    @field_validator("rating")
    @classmethod
    def validate_rating(cls, value: str):
        if value not in ["positive", "negative"]:
            raise ValueError(
                "rating must be 'positive' or 'negative'"
            )
        return value


class FeedbackResponse(BaseModel):
    id: int
    message: str
    rating: str
    comment: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class AdminFeedbackResponse(BaseModel):
    id: int
    farmer_name: str | None
    farmer_email: str
    message: str
    rating: str
    comment: str | None
    created_at: datetime

    class Config:
        from_attributes = True
=======
from pydantic import BaseModel
from typing import Optional

class FeedbackRequest(BaseModel):
    message_id: str
    feedback: str   # "up" or "down"
    comment: Optional[str] = None
>>>>>>> origin/reema-backend
