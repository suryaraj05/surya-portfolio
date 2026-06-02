from datetime import datetime, timezone

from fastapi import HTTPException, status
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.security import create_access_token, create_refresh_token, verify_password
from app.models.entities import TokenBlocklist, User


def login(db: Session, email: str, password: str) -> dict[str, str]:
    user = db.query(User).filter(User.email == email, User.is_active.is_(True)).first()
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    return {
        "access_token": create_access_token(str(user.id)),
        "refresh_token": create_refresh_token(str(user.id)),
    }


def refresh(db: Session, refresh_token: str) -> dict[str, str]:
    settings = get_settings()
    try:
        payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except JWTError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token") from exc
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")
    if db.query(TokenBlocklist).filter(TokenBlocklist.token == refresh_token).first():
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token revoked")
    subject = payload.get("sub")
    if not subject:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token subject missing")
    return {"access_token": create_access_token(subject), "refresh_token": create_refresh_token(subject)}


def revoke_token(db: Session, token: str) -> None:
    db.add(TokenBlocklist(token=token, created_at=datetime.now(timezone.utc)))
    db.commit()
