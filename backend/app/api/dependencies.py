from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.user import User
from app.utils.security import verify_access_token

security = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
    db: Session = Depends(get_db),
) -> User:

    if not credentials:
        raise HTTPException(
            status_code=401,
            detail="Authentication required."
        )

    try:
        token_data = verify_access_token(credentials.credentials)
    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token."
        )

    user = db.get(User, int(token_data["sub"]))

    if not user:
        raise HTTPException(
            status_code=401,
            detail="User not found."
        )

    if not user.is_active:
        raise HTTPException(
            status_code=403,
            detail="Account is inactive."
        )

    return user

def get_admin_user(
    current_user: User = Depends(get_current_user),
) -> User:

    if current_user.role.lower() != "admin":
        raise HTTPException(
            status_code=403,
            detail="Only administrators can perform this action."
        )

    return current_user