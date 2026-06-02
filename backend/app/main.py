import structlog
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.api.v2.router import router as api_v2_router
from app.core.config import get_settings
from app.core.exceptions import register_exception_handlers
from app.db.redis_client import redis_hlen
from app.db.session import SessionLocal
from app.middleware.audit import AuditLogMiddleware
from app.middleware.logging import RequestLogMiddleware
from app.middleware.validation import RequestValidationMiddleware
from app.models.entities import Blog, Contact, Event, Notification, Project, User, Visitor
from app.utils.responses import success_response

settings = get_settings()
cors_origins = settings.CORS_ORIGINS
allow_all_origins = isinstance(cors_origins, list) and "*" in cors_origins

structlog.configure(
    processors=[structlog.processors.TimeStamper(fmt="iso"), structlog.processors.JSONRenderer()],
)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.API_VERSION,
    description="SuryaOS Core API-first backend.",
    openapi_tags=[
        {"name": "auth", "description": "Authentication and token lifecycle."},
        {"name": "projects", "description": "Portfolio projects APIs."},
        {"name": "blogs", "description": "Blog content APIs."},
        {"name": "analytics", "description": "Visitor and event analytics APIs."},
    ],
)
app.add_middleware(RequestLogMiddleware)
app.add_middleware(RequestValidationMiddleware)
app.add_middleware(AuditLogMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=not allow_all_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_PREFIX)
app.include_router(api_v2_router)
register_exception_handlers(app)


@app.get("/liveness")
def liveness():
    return success_response("Liveness check passed", {"status": "alive"})


@app.get("/readiness")
def readiness():
    return success_response("Readiness check passed", {"status": "ready"})


@app.get("/health")
def health():
    return success_response("Health check passed", {"status": "healthy"})


@app.get("/version")
def version():
    return success_response("API version fetched", {"version": settings.API_VERSION, "api_prefix": settings.API_V1_PREFIX})


@app.get("/metrics")
def metrics():
    db = SessionLocal()
    try:
        data = {
            "users": db.query(User).count(),
            "projects": db.query(Project).count(),
            "blogs": db.query(Blog).count(),
            "contacts": db.query(Contact).count(),
            "events": db.query(Event).count(),
            "notifications": db.query(Notification).count(),
            "visitors": db.query(Visitor).count(),
            "live_visitors": redis_hlen("live_visitors"),
        }
    finally:
        db.close()
    return success_response("System metrics fetched", data)
