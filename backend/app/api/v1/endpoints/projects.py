from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.api.deps import require_admin
from app.db.session import get_db
from app.models.entities import Project
from app.schemas.common import APIResponse, ProjectCreate, ProjectOut, ProjectUpdate
from app.services.crud_service import create_event, list_projects, project_by_slug
from app.utils.cache import cache_get_json, cache_invalidate, cache_set_json
from app.utils.pagination import pagination_meta
from app.utils.query import apply_offset_pagination, apply_search, apply_sort
from app.utils.responses import success_response

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("", response_model=APIResponse, summary="List projects", description="List projects with pagination, sorting, filtering and search.")
def get_projects(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, ge=1, le=100),
    sort_by: str = Query(default="sort_order"),
    sort_order: str = Query(default="asc", pattern="^(asc|desc)$"),
    search: str | None = Query(default=None),
    featured: bool | None = Query(default=None),
    status: str | None = Query(default=None),
    db: Session = Depends(get_db),
) -> APIResponse:
    cache_key = f"projects:list:{page}:{page_size}:{sort_by}:{sort_order}:{search}:{featured}:{status}"
    cached = cache_get_json(cache_key)
    if cached:
        return success_response("Projects fetched", cached)
    query = db.query(Project).filter(Project.is_deleted.is_(False))
    if featured is not None:
        query = query.filter(Project.featured.is_(featured))
    if status:
        query = query.filter(Project.status == status)
    query = apply_search(query, Project, search, ["title", "short_description", "full_description"])
    total = query.count()
    query = apply_sort(query, Project, sort_by, sort_order)
    query, page, page_size = apply_offset_pagination(query, page, page_size)
    items = [ProjectOut.model_validate(item).model_dump(mode="json") for item in query.all()]
    payload = {"items": items, "pagination": pagination_meta(total, page, page_size)}
    cache_set_json(cache_key, payload)
    cache_set_json("projects:list", payload)
    return success_response("Projects fetched", payload)


@router.get("/{slug}", response_model=APIResponse, summary="Get project by slug")
def get_project(slug: str, db: Session = Depends(get_db)) -> APIResponse:
    item = project_by_slug(db, slug)
    if not item:
        raise HTTPException(status_code=404, detail="Project not found")
    create_event(db, "project_viewed", "project", str(item.id), {"project_id": item.id})
    return success_response("Project fetched", ProjectOut.model_validate(item).model_dump(mode="json"))


@router.post("", response_model=APIResponse, dependencies=[Depends(require_admin)], summary="Create project")
def create_project(payload: ProjectCreate, db: Session = Depends(get_db)) -> APIResponse:
    model = Project(**payload.model_dump())
    db.add(model)
    db.commit()
    db.refresh(model)
    cache_invalidate("projects")
    return success_response("Project created", ProjectOut.model_validate(model).model_dump(mode="json"))


@router.put("/{id}", response_model=APIResponse, dependencies=[Depends(require_admin)], summary="Update project")
def update_project(id: int, payload: ProjectUpdate, db: Session = Depends(get_db)) -> APIResponse:
    model = db.query(Project).filter(Project.id == id, Project.is_deleted.is_(False)).first()
    if not model:
        raise HTTPException(status_code=404, detail="Project not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(model, key, value)
    db.commit()
    db.refresh(model)
    cache_invalidate("projects")
    return success_response("Project updated", ProjectOut.model_validate(model).model_dump(mode="json"))


@router.delete("/{id}", dependencies=[Depends(require_admin)])
def delete_project(id: int, db: Session = Depends(get_db)) -> APIResponse:
    model = db.query(Project).filter(Project.id == id, Project.is_deleted.is_(False)).first()
    if not model:
        raise HTTPException(status_code=404, detail="Project not found")
    model.soft_delete()
    db.commit()
    cache_invalidate("projects")
    return success_response("Project deleted")


@router.post("/reorder", dependencies=[Depends(require_admin)])
def reorder_projects(order: list[int], db: Session = Depends(get_db)) -> APIResponse:
    for idx, project_id in enumerate(order):
        db.query(Project).filter(Project.id == project_id).update({"sort_order": idx})
    db.commit()
    cache_invalidate("projects")
    return success_response("Projects reordered")
