from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.models.user import User

from app.schemas.user import UserResponse

from app.services.admin_service import (
    dashboard_stats,
    get_all_users,
    get_user,
    delete_user,
    toggle_user_status,
)

from app.utils.security import verify_access_token

router = APIRouter()

security = HTTPBearer()


def get_current_admin(
    credentials: HTTPAuthorizationCredentials,
    db: Session,
):
    token = verify_access_token(credentials.credentials)

    user = db.get(User, int(token["sub"]))

    if user is None:
        raise HTTPException(404, "User not found")

    if user.role != "admin":
        raise HTTPException(403, "Only admin can access this endpoint.")

    return user


@router.get("/dashboard")
def dashboard(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    get_current_admin(credentials, db)
    return dashboard_stats(db)


@router.get("/users", response_model=list[UserResponse])
def users(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    get_current_admin(credentials, db)
    return get_all_users(db)


@router.get("/users/{user_id}", response_model=UserResponse)
def user_details(
    user_id: int,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    get_current_admin(credentials, db)

    user = get_user(db, user_id)

    if user is None:
        raise HTTPException(404, "User not found")

    return user


@router.patch("/users/{user_id}")
def change_status(
    user_id: int,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    get_current_admin(credentials, db)

    user = toggle_user_status(db, user_id)

    if user is None:
        raise HTTPException(404, "User not found")

    return {
        "message": "User status updated",
        "is_active": user.is_active,
    }


@router.delete("/users/{user_id}")
def remove_user(
    user_id: int,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    get_current_admin(credentials, db)

    user = delete_user(db, user_id)

    if user is None:
        raise HTTPException(404, "User not found")

    return {
        "message": "User deleted successfully"
    }