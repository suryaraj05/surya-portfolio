from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile
from sqlalchemy.orm import Session
from app.utils.pagination import pagination_meta
from app.utils.query import apply_offset_pagination, apply_search, apply_sort
from app.utils.responses import success_response

from app.api.deps import require_admin
from app.core.config import get_settings
from app.db.session import get_db
from app.models.entities import Media
from app.schemas.common import APIResponse

router = APIRouter(prefix="/media", tags=["media"])
settings = get_settings()


def _build_media_url(file_name: str) -> str:
    if settings.S3_ENDPOINT_URL:
        return f"{settings.S3_ENDPOINT_URL.rstrip('/')}/{file_name}"
    if settings.S3_BUCKET and settings.S3_REGION:
        return f"https://{settings.S3_BUCKET}.s3.{settings.S3_REGION}.amazonaws.com/{file_name}"
    return f"https://storage.local/{file_name}"


@router.post("/upload", dependencies=[Depends(require_admin)])
async def upload_media(file: UploadFile = File(...), db: Session = Depends(get_db)) -> APIResponse:
    content = await file.read()
    file_name = file.filename or "unknown"
    row = Media(
        file_name=file_name,
        file_url=_build_media_url(file_name),
        mime_type=file.content_type or "application/octet-stream",
        size_bytes=len(content),
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return success_response("Media uploaded", {"id": row.id, "url": row.file_url})


@router.get("", dependencies=[Depends(require_admin)])
def get_media(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    sort_by: str = Query(default="created_at"),
    sort_order: str = Query(default="desc", pattern="^(asc|desc)$"),
    search: str | None = Query(default=None),
    mime_type: str | None = Query(default=None),
    db: Session = Depends(get_db),
) -> APIResponse:
    query = db.query(Media)
    if mime_type:
        query = query.filter(Media.mime_type == mime_type)
    query = apply_search(query, Media, search, ["file_name", "file_url", "mime_type"])
    total = query.count()
    query = apply_sort(query, Media, sort_by, sort_order)
    query, page, page_size = apply_offset_pagination(query, page, page_size)
    rows = query.all()
    return success_response("Media fetched", {
        "items": [{"id": row.id, "name": row.file_name, "url": row.file_url, "mime_type": row.mime_type} for row in rows],
        "pagination": pagination_meta(total, page, page_size),
    })


@router.delete("/{id}", dependencies=[Depends(require_admin)])
def delete_media(id: int, db: Session = Depends(get_db)) -> APIResponse:
    row = db.query(Media).filter(Media.id == id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Media not found")
    db.delete(row)
    db.commit()
    return success_response("Media deleted")
