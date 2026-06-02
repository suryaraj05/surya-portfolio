from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, EmailStr


class ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class APIErrorPayload(BaseModel):
    code: str
    message: str


class APIResponse(BaseModel):
    success: bool = True
    message: str = "OK"
    data: Any = {}


class APIErrorResponse(BaseModel):
    success: bool = False
    error: APIErrorPayload


class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class LoginRequest(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={"example": {"email": "admin@suryaos.dev", "password": "Admin@123"}}
    )
    email: EmailStr
    password: str


class RefreshRequest(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={"example": {"refresh_token": "eyJhbGciOi..."}}
    )
    refresh_token: str


class UserOut(ORMModel):
    id: int
    email: EmailStr
    role: str


class ProjectBase(BaseModel):
    title: str
    slug: str
    short_description: str | None = None
    full_description: str | None = None
    problem: str | None = None
    solution: str | None = None
    architecture: str | None = None
    tech_stack: list[str] = []
    github_url: str | None = None
    demo_url: str | None = None
    featured: bool = False
    status: str = "draft"
    cover_image: str | None = None
    gallery_images: list[str] = []


class ProjectCreate(ProjectBase):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "title": "SuryaOS Core",
                "slug": "suryaos-core",
                "short_description": "Core platform API",
                "full_description": "Production API backend",
                "problem": "Need scalable backend",
                "solution": "Clean architecture FastAPI",
                "architecture": "Layered modular backend",
                "tech_stack": ["FastAPI", "PostgreSQL", "Redis"],
                "featured": True,
                "status": "published",
                "gallery_images": []
            }
        }
    )


class ProjectUpdate(BaseModel):
    title: str | None = None
    short_description: str | None = None
    full_description: str | None = None
    problem: str | None = None
    solution: str | None = None
    architecture: str | None = None
    tech_stack: list[str] | None = None
    github_url: str | None = None
    demo_url: str | None = None
    featured: bool | None = None
    status: str | None = None
    cover_image: str | None = None
    gallery_images: list[str] | None = None


class ProjectOut(ORMModel, ProjectBase):
    id: int
    created_at: datetime
    updated_at: datetime


class BlogBase(BaseModel):
    title: str
    slug: str
    excerpt: str | None = None
    content: str
    cover_image: str | None = None
    tags: list[str] = []
    categories: list[str] = []
    published: bool = False
    published_at: datetime | None = None


class BlogCreate(BlogBase):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "title": "Building SuryaOS Core",
                "slug": "building-suryaos-core",
                "excerpt": "Backend design decisions",
                "content": "Long-form article content",
                "tags": ["backend", "fastapi"],
                "categories": ["engineering"],
                "published": True
            }
        }
    )


class BlogUpdate(BaseModel):
    title: str | None = None
    excerpt: str | None = None
    content: str | None = None
    cover_image: str | None = None
    tags: list[str] | None = None
    categories: list[str] | None = None
    published: bool | None = None
    published_at: datetime | None = None


class BlogOut(ORMModel, BlogBase):
    id: int
    created_at: datetime
    updated_at: datetime


class ContactCreate(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "name": "Jane Doe",
                "email": "jane@example.com",
                "company": "Acme Inc.",
                "role": "CTO",
                "message": "Let's collaborate",
                "source_page": "/contact"
            }
        }
    )
    name: str
    email: EmailStr
    company: str | None = None
    role: str | None = None
    message: str
    source_page: str | None = None
    country: str | None = None
    ip_address: str | None = None


class ContactOut(ORMModel):
    id: int
    name: str
    email: EmailStr
    company: str | None = None
    role: str | None = None
    message: str
    source_page: str | None = None
    country: str | None = None
    ip_address: str | None = None
    status: str
    created_at: datetime


class AnalyticsEvent(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "event_type": "github_click",
                "visitor_id": "session_123",
                "metadata": {"source_page": "/projects"}
            }
        }
    )
    event_type: str
    visitor_id: str | None = None
    project_id: int | None = None
    country: str | None = None
    device: str | None = None
    browser: str | None = None
    referrer: str | None = None
    metadata: dict[str, Any] = {}


class VisitorCreate(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "session_id": "session_123",
                "ip_hash": "hashed_ip_value",
                "country": "IN",
                "city": "Bengaluru",
                "device": "mobile",
                "browser": "chrome",
                "os": "android",
                "landing_page": "/"
            }
        }
    )
    session_id: str
    ip_hash: str
    country: str | None = None
    city: str | None = None
    device: str | None = None
    browser: str | None = None
    os: str | None = None
    referrer: str | None = None
    landing_page: str | None = None


class SettingUpdate(BaseModel):
    site_title: str
    site_description: str | None = None
    github_url: str | None = None
    linkedin_url: str | None = None
    resume_url: str | None = None
    email: str | None = None
    phone: str | None = None
    location: str | None = None
    social_links: dict[str, Any] = {}
