from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.db.session import get_db
from app.schemas.common import APIResponse, AnalyticsEvent
from app.services.crud_service import create_event, create_notification
from app.utils.rate_limit import enforce_rate_limit
from app.utils.responses import success_response

router = APIRouter(prefix="/events", tags=["events"])
settings = get_settings()


@router.post("/resume-download")
def resume_download(payload: AnalyticsEvent, request: Request, db: Session = Depends(get_db)) -> APIResponse:
    enforce_rate_limit(request, "analytics_ingest", settings.RATE_LIMIT_ANALYTICS_PER_MINUTE)
    create_event(db, "resume_download", "visitor", payload.visitor_id, payload.model_dump())
    create_notification(db, "resume_download", "Resume Downloaded", "A visitor downloaded your resume")
    return success_response("Resume download event captured")


@router.post("/click")
def click(payload: AnalyticsEvent, request: Request, db: Session = Depends(get_db)) -> APIResponse:
    enforce_rate_limit(request, "analytics_ingest", settings.RATE_LIMIT_ANALYTICS_PER_MINUTE)
    create_event(db, payload.event_type, "visitor", payload.visitor_id, payload.model_dump())
    create_notification(db, payload.event_type, "Link Clicked", f"{payload.event_type} event captured")
    return success_response("Click event captured")
