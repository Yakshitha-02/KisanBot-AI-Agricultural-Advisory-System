from pydantic import BaseModel
from typing import Optional


class AskRequest(BaseModel):
    session_id: int
    question: str


class FeedbackRequest(BaseModel):
    message_id: int
    feedback: str          # "positive" or "negative"
    comment: Optional[str] = None