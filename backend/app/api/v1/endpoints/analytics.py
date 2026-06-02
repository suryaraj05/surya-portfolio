from datetime import datetime, timezone

from fastapi import APIRouter, Depends, Query, Request
from redis import RedisError
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.db.redis_client import redis_client, redis_hlen
from app.db.session import get_db
from app.models.entities import Event, Visitor
from app.schemas.common import APIResponse, AnalyticsEvent, VisitorCreate
from app.services.crud_service import create_event, dashboard_overview
from app.utils.rate_limit import enforce_rate_limit
from app.utils.responses import success_response

router = APIRouter(prefix="/analytics", tags=["analytics"])
settings = get_settings()


@router.post("/visit")
def create_visit(payload: VisitorCreate, request: Request, db: Session = Depends(get_db)) -> APIResponse:
    enforce_rate_limit(request, "analytics_ingest", settings.RATE_LIMIT_ANALYTICS_PER_MINUTE)
    now = datetime.now(timezone.utc)
    model = db.query(Visitor).filter(Visitor.session_id == payload.session_id).first()
    if model:
        model.last_seen = now
    else:
        model = Visitor(**payload.model_dump(), first_seen=now, last_seen=now)
        db.add(model)
    db.commit()
    try:
        redis_client.hset("live_visitors", payload.session_id, now.isoformat())
    except RedisError:
        pass
    return success_response("Visit captured")


@router.post("/page-view")
def page_view(payload: AnalyticsEvent, request: Request, db: Session = Depends(get_db)) -> APIResponse:
    enforce_rate_limit(request, "analytics_ingest", settings.RATE_LIMIT_ANALYTICS_PER_MINUTE)
    create_event(db, "page_view", "visitor", payload.visitor_id, payload.model_dump())
    return success_response("Page view captured")


@router.post("/session-end")
def session_end(session_id: str, request: Request) -> APIResponse:
    enforce_rate_limit(request, "analytics_ingest", settings.RATE_LIMIT_ANALYTICS_PER_MINUTE)
    try:
        redis_client.hdel("live_visitors", session_id)
    except RedisError:
        pass
    return success_response("Session ended")


@router.get("/dashboard")
def analytics_dashboard(db: Session = Depends(get_db)) -> APIResponse:
    return success_response("Analytics dashboard fetched", dashboard_overview(db))


@router.get("/visitors")
def visitors(
    cursor: int | None = Query(default=None),
    limit: int = Query(default=25, ge=1, le=100),
    country: str | None = Query(default=None),
    device: str | None = Query(default=None),
    search: str | None = Query(default=None),
    db: Session = Depends(get_db),
) -> APIResponse:
    query = db.query(Visitor)
    if cursor is not None:
        query = query.filter(Visitor.id < cursor)
    if country:
        query = query.filter(Visitor.country == country)
    if device:
        query = query.filter(Visitor.device == device)
    if search:
        query = query.filter(
            (Visitor.session_id.ilike(f"%{search}%")) | (Visitor.city.ilike(f"%{search}%")) | (Visitor.referrer.ilike(f"%{search}%"))
        )
    rows = query.order_by(Visitor.id.desc()).limit(limit + 1).all()
    has_more = len(rows) > limit
    rows = rows[:limit]
    next_cursor = rows[-1].id if has_more and rows else None
    return success_response("Visitors fetched", {
        "items": [{"id": row.id, "session_id": row.session_id, "last_seen": row.last_seen} for row in rows],
        "next_cursor": next_cursor,
    })


@router.get("/live")
def live() -> APIResponse:
    live_count = redis_hlen("live_visitors")
    return success_response("Live visitors fetched", {"live_visitors": live_count})


@router.get("/resume")
def resume_analytics(db: Session = Depends(get_db)) -> APIResponse:
    count = db.query(Event).filter(Event.event_type == "resume_download").count()
    return success_response("Resume analytics fetched", {"resume_downloads": count})


@router.get("/clicks")
def click_analytics(
    event_type: str | None = Query(default=None),
    cursor: int | None = Query(default=None),
    limit: int = Query(default=50, ge=1, le=100),
    db: Session = Depends(get_db),
) -> APIResponse:
    events_query = db.query(Event)
    if cursor is not None:
        events_query = events_query.filter(Event.id < cursor)
    if event_type:
        events_query = events_query.filter(Event.event_type == event_type)
    event_rows = events_query.order_by(Event.id.desc()).limit(limit + 1).all()
    has_more = len(event_rows) > limit
    event_rows = event_rows[:limit]
    next_cursor = event_rows[-1].id if has_more and event_rows else None
    rows = db.query(Event.event_type, func.count(Event.id)).group_by(Event.event_type).all()
    return success_response("Click analytics fetched", {
        "summary": {etype: count for etype, count in rows},
        "items": [{"id": row.id, "event_type": row.event_type, "timestamp": row.timestamp} for row in event_rows],
        "next_cursor": next_cursor,
    })
