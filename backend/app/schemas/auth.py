from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    role: str
    full_name: str | None = None


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    role: str
    full_name: str | None = None

    preferred_language: str | None = None
    preferred_crop: str | None = None
    state: str | None = None
    district: str | None = None

    voice_enabled: bool
    dark_mode: bool
    is_active: bool

    class Config:
        from_attributes = True