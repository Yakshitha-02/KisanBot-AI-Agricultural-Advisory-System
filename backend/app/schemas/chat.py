from pydantic import BaseModel


class AskRequest(BaseModel):
    session_id: int
    question: str


class FeedbackRequest(BaseModel):
    rating: int
    comment: str