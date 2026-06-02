from fastapi import APIRouter

from app.api.v1.endpoints import analytics, auth, blogs, contact, dashboard, events, media, notifications, projects, settings

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(projects.router)
api_router.include_router(blogs.router)
api_router.include_router(contact.router)
api_router.include_router(analytics.router)
api_router.include_router(events.router)
api_router.include_router(notifications.router)
api_router.include_router(dashboard.router)
api_router.include_router(settings.router)
api_router.include_router(media.router)
