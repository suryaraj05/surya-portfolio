from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.utils.pagination import pagination_meta
from app.utils.query import apply_offset_pagination, apply_search, apply_sort
from app.utils.responses import success_response

from app.api.deps import require_admin
from app.db.session import get_db
from app.models.entities import Notification
from app.schemas.common import APIResponse

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("", dependencies=[Depends(require_admin)])
def get_notifications(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    sort_by: str = Query(default="created_at"),
    sort_order: str = Query(default="desc", pattern="^(asc|desc)$"),
    search: str | None = Query(default=None),
    read: bool | None = Query(default=None),
    db: Session = Depends(get_db),
) -> APIResponse:
    query = db.query(Notification)
    if read is not None:
        query = query.filter(Notification.read.is_(read))
    query = apply_search(query, Notification, search, ["title", "message", "type"])
    total = query.count()
    query = apply_sort(query, Notification, sort_by, sort_order)
    query, page, page_size = apply_offset_pagination(query, page, page_size)
    rows = query.all()
    return success_response("Notifications fetched", {
        "items": [{"id": row.id, "type": row.type, "title": row.title, "message": row.message, "read": row.read} for row in rows],
        "pagination": pagination_meta(total, page, page_size),
    })


@router.put("/{id}/read", dependencies=[Depends(require_admin)])
def read_notification(id: int, db: Session = Depends(get_db)) -> APIResponse:
    row = db.query(Notification).filter(Notification.id == id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Notification not found")
    row.read = True
    db.commit()
    return success_response("Notification marked as read")


@router.delete("/{id}", dependencies=[Depends(require_admin)])
def delete_notification(id: int, db: Session = Depends(get_db)) -> APIResponse:
    row = db.query(Notification).filter(Notification.id == id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Notification not found")
    db.delete(row)
    db.commit()
    return success_response("Notification deleted")
