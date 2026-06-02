from fastapi import APIRouter, Depends, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.db.redis_client import redis_hlen
from app.db.session import get_db
from app.models.entities import Event
from app.services.crud_service import dashboard_overview
from app.schemas.common import APIResponse
from app.utils.responses import success_response

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/overview")
def overview(db: Session = Depends(get_db)) -> APIResponse:
    return success_response("Dashboard overview fetched", dashboard_overview(db))


@router.get("/live")
def live() -> APIResponse:
    return success_response("Dashboard live stats fetched", {"live_visitors": redis_hlen("live_visitors")})


@router.get("/top-projects")
def top_projects(limit: int = Query(default=10, ge=1, le=100), db: Session = Depends(get_db)) -> APIResponse:
    rows = (
        db.query(Event.project_id, func.count(Event.id))
        .filter(Event.event_type == "project_viewed")
        .group_by(Event.project_id)
        .order_by(func.count(Event.id).desc())
        .limit(limit)
        .all()
    )
    return success_response("Top projects fetched", {"top_projects": [{"project_id": project_id, "views": views} for project_id, views in rows]})


@router.get("/top-pages")
def top_pages(limit: int = Query(default=10, ge=1, le=100), db: Session = Depends(get_db)) -> APIResponse:
    rows = (
        db.query(Event.entity_id, func.count(Event.id))
        .filter(Event.event_type == "page_view")
        .group_by(Event.entity_id)
        .order_by(func.count(Event.id).desc())
        .limit(limit)
        .all()
    )
    return success_response("Top pages fetched", {"top_pages": [{"page": page, "views": views} for page, views in rows]})


@router.get("/recent-events")
def recent_events(
    cursor: int | None = Query(default=None),
    limit: int = Query(default=30, ge=1, le=100),
    event_type: str | None = Query(default=None),
    db: Session = Depends(get_db),
) -> APIResponse:
    query = db.query(Event)
    if cursor is not None:
        query = query.filter(Event.id < cursor)
    if event_type:
        query = query.filter(Event.event_type == event_type)
    rows = query.order_by(Event.id.desc()).limit(limit + 1).all()
    has_more = len(rows) > limit
    rows = rows[:limit]
    next_cursor = rows[-1].id if has_more and rows else None
    return success_response("Recent events fetched", {
        "events": [{"id": row.id, "event_type": row.event_type, "timestamp": row.timestamp} for row in rows],
        "next_cursor": next_cursor,
    })
