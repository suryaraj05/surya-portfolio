from datetime import datetime, timezone
from typing import Any

from sqlalchemy.orm import Session

from app.models.entities import Blog, Contact, Event, Media, Notification, Project, Setting, Visitor
from app.utils.cache import cache_get_json, cache_invalidate, cache_set_json


def list_projects(db: Session) -> list[Project]:
    return db.query(Project).filter(Project.is_deleted.is_(False)).order_by(Project.sort_order.asc()).all()


def project_by_slug(db: Session, slug: str) -> Project | None:
    return db.query(Project).filter(Project.slug == slug, Project.is_deleted.is_(False)).first()


def list_blogs(db: Session) -> list[Blog]:
    return db.query(Blog).filter(Blog.is_deleted.is_(False)).order_by(Blog.created_at.desc()).all()


def blog_by_slug(db: Session, slug: str) -> Blog | None:
    return db.query(Blog).filter(Blog.slug == slug, Blog.is_deleted.is_(False)).first()


def create_notification(db: Session, notification_type: str, title: str, message: str) -> None:
    db.add(Notification(type=notification_type, title=title, message=message))
    db.commit()


def create_event(db: Session, event_type: str, entity_type: str | None, entity_id: str | None, payload: dict[str, Any]) -> Event:
    event = Event(
        event_type=event_type,
        entity_type=entity_type,
        entity_id=entity_id,
        event_metadata=payload,
        timestamp=datetime.now(timezone.utc),
        visitor_id=payload.get("visitor_id"),
        project_id=payload.get("project_id"),
        country=payload.get("country"),
        device=payload.get("device"),
        browser=payload.get("browser"),
        referrer=payload.get("referrer"),
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    return event


def get_or_create_settings(db: Session) -> Setting:
    settings = db.query(Setting).first()
    if settings:
        cache_set_json(
            "settings:singleton",
            {
                "id": settings.id,
                "site_title": settings.site_title,
                "site_description": settings.site_description,
                "github_url": settings.github_url,
                "linkedin_url": settings.linkedin_url,
                "resume_url": settings.resume_url,
                "email": settings.email,
                "phone": settings.phone,
                "location": settings.location,
                "social_links": settings.social_links,
            },
        )
        return settings
    settings = Setting(site_title="SuryaOS")
    db.add(settings)
    db.commit()
    db.refresh(settings)
    cache_invalidate("settings")
    return settings


def dashboard_overview(db: Session) -> dict[str, int]:
    cached = cache_get_json("dashboard:overview")
    if cached:
        return cached
    payload = {
        "projects": db.query(Project).filter(Project.is_deleted.is_(False)).count(),
        "blogs": db.query(Blog).filter(Blog.is_deleted.is_(False)).count(),
        "contacts": db.query(Contact).count(),
        "events": db.query(Event).count(),
        "visitors": db.query(Visitor).count(),
        "notifications": db.query(Notification).count(),
        "media_items": db.query(Media).count(),
    }
    cache_set_json("dashboard:overview", payload)
    return payload
