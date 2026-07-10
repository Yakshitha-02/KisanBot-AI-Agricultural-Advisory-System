from pydantic import BaseModel

class DocumentResponse(BaseModel):
    id: int
    title: str
    description: str | None = None
    file_path: str

    class Config:
        orm_mode = True
