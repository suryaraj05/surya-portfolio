from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.orm import Session

from app.api.deps import require_admin
from app.core.config import get_settings
from app.db.session import get_db
from app.models.entities import Contact
from app.schemas.common import APIResponse, ContactCreate, ContactOut
from app.services.crud_service import create_event, create_notification
from app.utils.pagination import pagination_meta
from app.utils.query import apply_offset_pagination, apply_search, apply_sort
from app.utils.rate_limit import enforce_rate_limit
from app.utils.responses import success_response

router = APIRouter(tags=["contact"])
settings = get_settings()


@router.post(
    "/contact",
    response_model=APIResponse,
    summary="Submit contact request",
    description="Create a new contact inquiry from public site.",
)
def create_contact(payload: ContactCreate, request: Request, db: Session = Depends(get_db)) -> APIResponse:
    enforce_rate_limit(request, "contact", settings.RATE_LIMIT_CONTACT_PER_MINUTE)
    model = Contact(**payload.model_dump())
    db.add(model)
    db.commit()
    db.refresh(model)
    create_notification(db, "contact_submitted", "New Contact", f"{model.name} submitted contact form")
    create_event(db, "contact_submitted", "contact", str(model.id), payload.model_dump())
    return success_response("Contact request submitted", ContactOut.model_validate(model).model_dump(mode="json"))


@router.get("/admin/contact", dependencies=[Depends(require_admin)])
def get_contacts(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    sort_by: str = Query(default="created_at"),
    sort_order: str = Query(default="desc", pattern="^(asc|desc)$"),
    search: str | None = Query(default=None),
    status: str | None = Query(default=None),
    db: Session = Depends(get_db),
) -> APIResponse:
    query = db.query(Contact)
    if status:
        query = query.filter(Contact.status == status)
    query = apply_search(query, Contact, search, ["name", "email", "message", "company"])
    total = query.count()
    query = apply_sort(query, Contact, sort_by, sort_order)
    query, page, page_size = apply_offset_pagination(query, page, page_size)
    items = [ContactOut.model_validate(item).model_dump(mode="json") for item in query.all()]
    return success_response("Contacts fetched", {"items": items, "pagination": pagination_meta(total, page, page_size)})


@router.put("/admin/contact/{id}", dependencies=[Depends(require_admin)])
def update_contact(id: int, status_value: str, db: Session = Depends(get_db)) -> APIResponse:
    model = db.query(Contact).filter(Contact.id == id).first()
    if not model:
        raise HTTPException(status_code=404, detail="Contact not found")
    model.status = status_value
    db.commit()
    return success_response("Contact updated")


@router.delete("/admin/contact/{id}", dependencies=[Depends(require_admin)])
def delete_contact(id: int, db: Session = Depends(get_db)) -> APIResponse:
    model = db.query(Contact).filter(Contact.id == id).first()
    if not model:
        raise HTTPException(status_code=404, detail="Contact not found")
    db.delete(model)
    db.commit()
    return success_response("Contact deleted")
