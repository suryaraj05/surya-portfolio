from fastapi import APIRouter

from app.schemas.common import APIResponse
from app.utils.responses import success_response

router = APIRouter(prefix="/api/v2", tags=["v2"])


@router.get("/status")
def v2_status() -> APIResponse:
    return success_response("v2 status", {"message": "v2 namespace reserved for non-breaking evolution"})
