from pydantic import BaseModel
from typing import Optional

class FeedbackRequest(BaseModel):
    message_id: str
    feedback: str   # "up" or "down"
    comment: Optional[str] = None