import re
from fastapi import HTTPException

MAX_LENGTH = 500

def sanitize_message(message: str) -> str:
    if not message or not message.strip():
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty."
        )

    # Remove HTML tags
    message = re.sub(r"<.*?>", "", message)

    # Remove extra spaces
    message = re.sub(r"\s+", " ", message).strip()

    if len(message) > MAX_LENGTH:
        raise HTTPException(
            status_code=400,
            detail=f"Question must not exceed {MAX_LENGTH} characters."
        )

    return message