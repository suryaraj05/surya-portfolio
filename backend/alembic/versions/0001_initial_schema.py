"""initial schema

Revision ID: 0001_initial_schema
Revises:
Create Date: 2026-06-02
"""

from alembic import op
import sqlalchemy as sa


revision = "0001_initial_schema"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("role", sa.String(length=11), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)

    op.create_table(
        "projects",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("slug", sa.String(length=255), nullable=False),
        sa.Column("short_description", sa.String(length=500)),
        sa.Column("full_description", sa.Text()),
        sa.Column("problem", sa.Text()),
        sa.Column("solution", sa.Text()),
        sa.Column("architecture", sa.Text()),
        sa.Column("tech_stack", sa.JSON(), nullable=False),
        sa.Column("github_url", sa.String(length=500)),
        sa.Column("demo_url", sa.String(length=500)),
        sa.Column("featured", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("status", sa.String(length=50), nullable=False),
        sa.Column("cover_image", sa.String(length=500)),
        sa.Column("gallery_images", sa.JSON(), nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("is_deleted", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("deleted_at", sa.DateTime(timezone=True)),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_projects_slug", "projects", ["slug"], unique=True)
    op.create_index("idx_projects_featured_status", "projects", ["featured", "status"], unique=False)

    op.create_table(
        "blogs",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("slug", sa.String(length=255), nullable=False),
        sa.Column("excerpt", sa.String(length=600)),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("cover_image", sa.String(length=500)),
        sa.Column("tags", sa.JSON(), nullable=False),
        sa.Column("categories", sa.JSON(), nullable=False),
        sa.Column("published", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("published_at", sa.DateTime(timezone=True)),
        sa.Column("is_deleted", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("deleted_at", sa.DateTime(timezone=True)),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_blogs_slug", "blogs", ["slug"], unique=True)

    op.create_table(
        "contacts",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("company", sa.String(length=255)),
        sa.Column("role", sa.String(length=255)),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("source_page", sa.String(length=500)),
        sa.Column("country", sa.String(length=100)),
        sa.Column("ip_address", sa.String(length=64)),
        sa.Column("status", sa.String(length=8), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    op.create_table(
        "visitors",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("session_id", sa.String(length=128), nullable=False),
        sa.Column("ip_hash", sa.String(length=255), nullable=False),
        sa.Column("country", sa.String(length=100)),
        sa.Column("city", sa.String(length=100)),
        sa.Column("device", sa.String(length=100)),
        sa.Column("browser", sa.String(length=100)),
        sa.Column("os", sa.String(length=100)),
        sa.Column("referrer", sa.String(length=500)),
        sa.Column("landing_page", sa.String(length=500)),
        sa.Column("pages_viewed", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("time_on_site", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("first_seen", sa.DateTime(timezone=True), nullable=False),
        sa.Column("last_seen", sa.DateTime(timezone=True), nullable=False),
    )

    op.create_table(
        "events",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("event_type", sa.String(length=120), nullable=False),
        sa.Column("entity_type", sa.String(length=120)),
        sa.Column("entity_id", sa.String(length=120)),
        sa.Column("visitor_id", sa.String(length=120)),
        sa.Column("project_id", sa.Integer(), sa.ForeignKey("projects.id")),
        sa.Column("metadata", sa.JSON(), nullable=False),
        sa.Column("timestamp", sa.DateTime(timezone=True), nullable=False),
        sa.Column("country", sa.String(length=100)),
        sa.Column("device", sa.String(length=100)),
        sa.Column("browser", sa.String(length=100)),
        sa.Column("referrer", sa.String(length=500)),
    )
    op.create_index("idx_events_type_time", "events", ["event_type", "timestamp"], unique=False)

    op.create_table(
        "notifications",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("type", sa.String(length=120), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("read", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    op.create_table(
        "settings",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("site_title", sa.String(length=255), nullable=False),
        sa.Column("site_description", sa.String(length=1000)),
        sa.Column("github_url", sa.String(length=500)),
        sa.Column("linkedin_url", sa.String(length=500)),
        sa.Column("resume_url", sa.String(length=500)),
        sa.Column("email", sa.String(length=255)),
        sa.Column("phone", sa.String(length=50)),
        sa.Column("location", sa.String(length=255)),
        sa.Column("social_links", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    op.create_table(
        "media",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("file_name", sa.String(length=255), nullable=False),
        sa.Column("file_url", sa.String(length=600), nullable=False),
        sa.Column("mime_type", sa.String(length=120), nullable=False),
        sa.Column("size_bytes", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    op.create_table(
        "token_blocklist",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("token", sa.String(length=1000), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )

    op.create_table(
        "audit_logs",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("actor", sa.String(length=255), nullable=False),
        sa.Column("action", sa.String(length=255), nullable=False),
        sa.Column("entity_type", sa.String(length=120)),
        sa.Column("entity_id", sa.String(length=120)),
        sa.Column("metadata", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("audit_logs")
    op.drop_table("token_blocklist")
    op.drop_table("media")
    op.drop_table("settings")
    op.drop_table("notifications")
    op.drop_index("idx_events_type_time", table_name="events")
    op.drop_table("events")
    op.drop_table("visitors")
    op.drop_table("contacts")
    op.drop_index("ix_blogs_slug", table_name="blogs")
    op.drop_table("blogs")
    op.drop_index("idx_projects_featured_status", table_name="projects")
    op.drop_index("ix_projects_slug", table_name="projects")
    op.drop_table("projects")
    op.drop_index("ix_users_email", table_name="users")
    op.drop_table("users")
