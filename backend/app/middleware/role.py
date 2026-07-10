from fastapi import HTTPException

def require_role(role: str):
    def decorator(user_role: str):
        if user_role != role:
            raise HTTPException(status_code=403, detail='Forbidden')
    return decorator
