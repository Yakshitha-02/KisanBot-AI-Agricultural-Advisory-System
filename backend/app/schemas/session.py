from pydantic import BaseModel
from datetime import datetime


class SessionCreateResponse(BaseModel):
    id: int
    title: str
    created_at: datetime


class SessionResponse(BaseModel):
    id: int
    title: str
    created_at: datetime