from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.config import get_settings
from app.db.session import get_db
from app.schemas.common import APIResponse, LoginRequest, RefreshRequest, TokenPair, UserOut
from app.services.auth_service import login, refresh, revoke_token
from app.utils.rate_limit import enforce_rate_limit
from app.utils.responses import success_response

router = APIRouter(prefix="/auth", tags=["auth"])
settings = get_settings()


@router.post(
    "/login",
    response_model=APIResponse,
    summary="Admin login",
    description="Authenticate admin and return access/refresh JWT tokens.",
)
def login_endpoint(payload: LoginRequest, request: Request, db: Session = Depends(get_db)) -> APIResponse:
    enforce_rate_limit(request, "login", settings.RATE_LIMIT_LOGIN_PER_MINUTE)
    tokens = login(db, payload.email, payload.password)
    return success_response("Login successful", TokenPair(**tokens).model_dump())


@router.post("/refresh", response_model=APIResponse, summary="Refresh tokens", description="Issue a new JWT pair from a refresh token.")
def refresh_endpoint(payload: RefreshRequest, db: Session = Depends(get_db)) -> APIResponse:
    tokens = refresh(db, payload.refresh_token)
    return success_response("Token refreshed", TokenPair(**tokens).model_dump())


@router.post("/logout")
def logout_endpoint(payload: RefreshRequest, db: Session = Depends(get_db)) -> APIResponse:
    revoke_token(db, payload.refresh_token)
    return success_response("Logged out")


@router.get("/me", response_model=APIResponse, summary="Get current admin profile")
def me_endpoint(user=Depends(get_current_user)) -> APIResponse:
    return success_response("Current user fetched", UserOut.model_validate(user).model_dump(mode="json"))
