from pydantic import BaseModel
from datetime import datetime


class DocumentResponse(BaseModel):
    id: int
    title: str
    filename: str
    filepath: str
    file_size: int
    pages: int
    language: str
    category: str
    status: str
    uploaded_by: int
    uploaded_at: datetime

    class Config:
        from_attributes = True