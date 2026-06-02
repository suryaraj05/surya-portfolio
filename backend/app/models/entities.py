from datetime import datetime

from sqlalchemy import JSON, Boolean, DateTime, ForeignKey, Index, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base
from app.models.common import ContactStatus, RoleEnum, SoftDeleteMixin, TimestampMixin


class User(Base, TimestampMixin):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    role: Mapped[RoleEnum] = mapped_column(default=RoleEnum.ADMIN)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)


class Project(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "projects"
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(255), index=True)
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    short_description: Mapped[str | None] = mapped_column(String(500))
    full_description: Mapped[str | None] = mapped_column(Text)
    problem: Mapped[str | None] = mapped_column(Text)
    solution: Mapped[str | None] = mapped_column(Text)
    architecture: Mapped[str | None] = mapped_column(Text)
    tech_stack: Mapped[list[str]] = mapped_column(JSON, default=list)
    github_url: Mapped[str | None] = mapped_column(String(500))
    demo_url: Mapped[str | None] = mapped_column(String(500))
    featured: Mapped[bool] = mapped_column(Boolean, default=False)
    status: Mapped[str] = mapped_column(String(50), default="draft")
    cover_image: Mapped[str | None] = mapped_column(String(500))
    gallery_images: Mapped[list[str]] = mapped_column(JSON, default=list)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)


class Blog(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "blogs"
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(255), index=True)
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    excerpt: Mapped[str | None] = mapped_column(String(600))
    content: Mapped[str] = mapped_column(Text)
    cover_image: Mapped[str | None] = mapped_column(String(500))
    tags: Mapped[list[str]] = mapped_column(JSON, default=list)
    categories: Mapped[list[str]] = mapped_column(JSON, default=list)
    published: Mapped[bool] = mapped_column(Boolean, default=False)
    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)


class Contact(Base, TimestampMixin):
    __tablename__ = "contacts"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255))
    email: Mapped[str] = mapped_column(String(255), index=True)
    company: Mapped[str | None] = mapped_column(String(255))
    role: Mapped[str | None] = mapped_column(String(255))
    message: Mapped[str] = mapped_column(Text)
    source_page: Mapped[str | None] = mapped_column(String(500))
    country: Mapped[str | None] = mapped_column(String(100))
    ip_address: Mapped[str | None] = mapped_column(String(64))
    status: Mapped[ContactStatus] = mapped_column(default=ContactStatus.NEW, index=True)


class Visitor(Base):
    __tablename__ = "visitors"
    id: Mapped[int] = mapped_column(primary_key=True)
    session_id: Mapped[str] = mapped_column(String(128), unique=True, index=True)
    ip_hash: Mapped[str] = mapped_column(String(255), index=True)
    country: Mapped[str | None] = mapped_column(String(100))
    city: Mapped[str | None] = mapped_column(String(100))
    device: Mapped[str | None] = mapped_column(String(100))
    browser: Mapped[str | None] = mapped_column(String(100))
    os: Mapped[str | None] = mapped_column(String(100))
    referrer: Mapped[str | None] = mapped_column(String(500))
    landing_page: Mapped[str | None] = mapped_column(String(500))
    pages_viewed: Mapped[int] = mapped_column(default=0)
    time_on_site: Mapped[int] = mapped_column(default=0)
    first_seen: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    last_seen: Mapped[datetime] = mapped_column(DateTime(timezone=True))


class Event(Base):
    __tablename__ = "events"
    id: Mapped[int] = mapped_column(primary_key=True)
    event_type: Mapped[str] = mapped_column(String(120), index=True)
    entity_type: Mapped[str | None] = mapped_column(String(120), index=True)
    entity_id: Mapped[str | None] = mapped_column(String(120), index=True)
    visitor_id: Mapped[str | None] = mapped_column(String(120), index=True)
    project_id: Mapped[int | None] = mapped_column(ForeignKey("projects.id"), nullable=True)
    event_metadata: Mapped[dict] = mapped_column("metadata", JSON, default=dict)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)
    country: Mapped[str | None] = mapped_column(String(100))
    device: Mapped[str | None] = mapped_column(String(100))
    browser: Mapped[str | None] = mapped_column(String(100))
    referrer: Mapped[str | None] = mapped_column(String(500))


class Notification(Base, TimestampMixin):
    __tablename__ = "notifications"
    id: Mapped[int] = mapped_column(primary_key=True)
    type: Mapped[str] = mapped_column(String(120), index=True)
    title: Mapped[str] = mapped_column(String(255))
    message: Mapped[str] = mapped_column(Text)
    read: Mapped[bool] = mapped_column(Boolean, default=False, index=True)


class Setting(Base, TimestampMixin):
    __tablename__ = "settings"
    id: Mapped[int] = mapped_column(primary_key=True)
    site_title: Mapped[str] = mapped_column(String(255), default="SuryaOS")
    site_description: Mapped[str | None] = mapped_column(String(1000))
    github_url: Mapped[str | None] = mapped_column(String(500))
    linkedin_url: Mapped[str | None] = mapped_column(String(500))
    resume_url: Mapped[str | None] = mapped_column(String(500))
    email: Mapped[str | None] = mapped_column(String(255))
    phone: Mapped[str | None] = mapped_column(String(50))
    location: Mapped[str | None] = mapped_column(String(255))
    social_links: Mapped[dict] = mapped_column(JSON, default=dict)


class Media(Base, TimestampMixin):
    __tablename__ = "media"
    id: Mapped[int] = mapped_column(primary_key=True)
    file_name: Mapped[str] = mapped_column(String(255))
    file_url: Mapped[str] = mapped_column(String(600))
    mime_type: Mapped[str] = mapped_column(String(120))
    size_bytes: Mapped[int] = mapped_column()


class TokenBlocklist(Base):
    __tablename__ = "token_blocklist"
    id: Mapped[int] = mapped_column(primary_key=True)
    token: Mapped[str] = mapped_column(String(1000), unique=True, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))


class AuditLog(Base):
    __tablename__ = "audit_logs"
    id: Mapped[int] = mapped_column(primary_key=True)
    actor: Mapped[str] = mapped_column(String(255), index=True)
    action: Mapped[str] = mapped_column(String(255), index=True)
    entity_type: Mapped[str | None] = mapped_column(String(120), index=True)
    entity_id: Mapped[str | None] = mapped_column(String(120), index=True)
    metadata_json: Mapped[dict] = mapped_column("metadata", JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)


Index("idx_events_type_time", Event.event_type, Event.timestamp)
Index("idx_projects_featured_status", Project.featured, Project.status)
