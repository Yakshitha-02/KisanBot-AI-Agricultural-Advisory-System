from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, RegisterRequest
from app.utils.security import create_access_token, hash_password, verify_access_token, verify_password

router = APIRouter()
security = HTTPBearer(auto_error=False)


def _serialize_user(user: User) -> dict:
    return {
        "id": user.id,
        "email": user.email,
        "role": user.role,
        "full_name": user.full_name,
        "preferred_language": user.preferred_language,
        "preferred_crop": user.preferred_crop,
        "state": user.state,
        "district": user.district,
        "voice_enabled": user.voice_enabled,
        "dark_mode": user.dark_mode,
        "is_active": user.is_active,
    }


@router.post('/register', status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    # Create a new user account, hash the password, and issue a JWT on success.
    normalized_email = payload.email.lower()
    existing_user = db.query(User).filter(User.email == normalized_email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail='An account with this email already exists.')

    role = payload.role.lower()
    if role not in {'farmer', 'admin'}:
        raise HTTPException(status_code=400, detail='Role must be either farmer or admin.')

    user = User(
    email=normalized_email,
    hashed_password=hash_password(payload.password),
    role=role,
    full_name=payload.full_name,

    preferred_language="English",
    preferred_crop=None,
    state=None,
    district=None,
    voice_enabled=False,
    dark_mode=False,

    is_active=True,
)
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({'sub': str(user.id), 'email': user.email, 'role': user.role})
    return {'access_token': token, 'token_type': 'bearer', 'user': _serialize_user(user)}


@router.post('/login')
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    # Validate credentials, verify the password hash, and return an access token.
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail='Invalid email or password.')

    if not user.is_active:
        raise HTTPException(status_code=403, detail='This account is inactive.')

    token = create_access_token({'sub': str(user.id), 'email': user.email, 'role': user.role})
    return {'access_token': token, 'token_type': 'bearer', 'user': _serialize_user(user)}


@router.get('/me')
def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
    db: Session = Depends(get_db),
):
    if not credentials:
        raise HTTPException(status_code=401, detail='Authentication credentials were not provided.')

    try:
        token_data = verify_access_token(credentials.credentials)
    except Exception as exc:
        raise HTTPException(status_code=401, detail='Invalid or expired token.') from exc

    user = db.get(User, int(token_data['sub']))
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail='User not found or inactive.')

    return _serialize_user(user)
