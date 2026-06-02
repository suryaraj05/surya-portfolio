from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import require_admin
from app.db.session import get_db
from app.schemas.common import APIResponse, SettingUpdate
from app.services.crud_service import get_or_create_settings
from app.utils.cache import cache_get_json, cache_invalidate, cache_set_json
from app.utils.responses import success_response

router = APIRouter(prefix="/settings", tags=["settings"])


@router.get("")
def get_settings(db: Session = Depends(get_db)) -> APIResponse:
    cached = cache_get_json("settings:singleton")
    if cached:
        return success_response("Settings fetched", cached)
    row = get_or_create_settings(db)
    payload = {
        "site_title": row.site_title,
        "site_description": row.site_description,
        "github_url": row.github_url,
        "linkedin_url": row.linkedin_url,
        "resume_url": row.resume_url,
        "email": row.email,
        "phone": row.phone,
        "location": row.location,
        "social_links": row.social_links,
    }
    cache_set_json("settings:singleton", payload)
    return success_response("Settings fetched", payload)


@router.put("", dependencies=[Depends(require_admin)])
def update_settings(payload: SettingUpdate, db: Session = Depends(get_db)) -> APIResponse:
    row = get_or_create_settings(db)
    for key, value in payload.model_dump().items():
        setattr(row, key, value)
    db.commit()
    db.refresh(row)
    cache_invalidate("settings")
    return success_response("Settings updated")
