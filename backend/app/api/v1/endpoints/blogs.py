from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.api.deps import require_admin
from app.db.session import get_db
from app.models.entities import Blog
from app.schemas.common import APIResponse, BlogCreate, BlogOut, BlogUpdate
from app.services.crud_service import blog_by_slug
from app.utils.cache import cache_get_json, cache_invalidate, cache_set_json
from app.utils.pagination import pagination_meta
from app.utils.query import apply_offset_pagination, apply_search, apply_sort
from app.utils.responses import success_response

router = APIRouter(prefix="/blogs", tags=["blogs"])


@router.get("", response_model=APIResponse, summary="List blogs")
def get_blogs(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, ge=1, le=100),
    sort_by: str = Query(default="created_at"),
    sort_order: str = Query(default="desc", pattern="^(asc|desc)$"),
    search: str | None = Query(default=None),
    published: bool | None = Query(default=None),
    db: Session = Depends(get_db),
) -> APIResponse:
    cache_key = f"blogs:list:{page}:{page_size}:{sort_by}:{sort_order}:{search}:{published}"
    cached = cache_get_json(cache_key)
    if cached:
        return success_response("Blogs fetched", cached)
    query = db.query(Blog).filter(Blog.is_deleted.is_(False))
    if published is not None:
        query = query.filter(Blog.published.is_(published))
    query = apply_search(query, Blog, search, ["title", "excerpt", "content"])
    total = query.count()
    query = apply_sort(query, Blog, sort_by, sort_order)
    query, page, page_size = apply_offset_pagination(query, page, page_size)
    items = [BlogOut.model_validate(item).model_dump(mode="json") for item in query.all()]
    payload = {"items": items, "pagination": pagination_meta(total, page, page_size)}
    cache_set_json(cache_key, payload)
    cache_set_json("blogs:list", payload)
    return success_response("Blogs fetched", payload)


@router.get("/{slug}", response_model=APIResponse, summary="Get blog by slug")
def get_blog(slug: str, db: Session = Depends(get_db)) -> APIResponse:
    blog = blog_by_slug(db, slug)
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    return success_response("Blog fetched", BlogOut.model_validate(blog).model_dump(mode="json"))


@router.post("", response_model=APIResponse, dependencies=[Depends(require_admin)], summary="Create blog")
def create_blog(payload: BlogCreate, db: Session = Depends(get_db)) -> APIResponse:
    model = Blog(**payload.model_dump())
    db.add(model)
    db.commit()
    db.refresh(model)
    cache_invalidate("blogs")
    return success_response("Blog created", BlogOut.model_validate(model).model_dump(mode="json"))


@router.put("/{id}", response_model=APIResponse, dependencies=[Depends(require_admin)], summary="Update blog")
def update_blog(id: int, payload: BlogUpdate, db: Session = Depends(get_db)) -> APIResponse:
    model = db.query(Blog).filter(Blog.id == id, Blog.is_deleted.is_(False)).first()
    if not model:
        raise HTTPException(status_code=404, detail="Blog not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(model, key, value)
    db.commit()
    db.refresh(model)
    cache_invalidate("blogs")
    return success_response("Blog updated", BlogOut.model_validate(model).model_dump(mode="json"))


@router.delete("/{id}", dependencies=[Depends(require_admin)])
def delete_blog(id: int, db: Session = Depends(get_db)) -> APIResponse:
    model = db.query(Blog).filter(Blog.id == id, Blog.is_deleted.is_(False)).first()
    if not model:
        raise HTTPException(status_code=404, detail="Blog not found")
    model.soft_delete()
    db.commit()
    cache_invalidate("blogs")
    return success_response("Blog deleted")
