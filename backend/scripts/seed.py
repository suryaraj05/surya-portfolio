from datetime import datetime, timezone
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from app.core.security import create_password_hash
from app.db.session import SessionLocal
from app.models.common import RoleEnum
from app.models.entities import Blog, Notification, Project, Setting, User


def run_seed() -> None:
    db = SessionLocal()
    try:
        admin = db.query(User).filter(User.email == "admin@suryaos.dev").first()
        if not admin:
            db.add(
                User(
                    email="admin@suryaos.dev",
                    password_hash=create_password_hash("Admin@123"),
                    role=RoleEnum.SUPER_ADMIN,
                    is_active=True,
                )
            )

        if db.query(Project).count() == 0:
            db.add_all(
                [
                    Project(
                        title="SuryaOS Core",
                        slug="suryaos-core",
                        short_description="Core platform backend",
                        full_description="Production backend for portfolio ecosystem",
                        featured=True,
                        status="published",
                        tech_stack=["FastAPI", "PostgreSQL", "Redis"],
                        gallery_images=[],
                    ),
                    Project(
                        title="VoxGraph",
                        slug="voxgraph",
                        short_description="Audio intelligence platform",
                        full_description="Speech + insights tooling",
                        featured=False,
                        status="published",
                        tech_stack=["Python", "ML"],
                        gallery_images=[],
                    ),
                ]
            )

        if db.query(Blog).count() == 0:
            db.add(
                Blog(
                    title="Building SuryaOS Core",
                    slug="building-suryaos-core",
                    excerpt="Architecture and learnings",
                    content="This article explains architecture decisions.",
                    tags=["architecture", "backend"],
                    categories=["engineering"],
                    published=True,
                    published_at=datetime.now(timezone.utc),
                )
            )

        if db.query(Setting).count() == 0:
            db.add(
                Setting(
                    site_title="SuryaOS",
                    site_description="Personal platform",
                    github_url="https://github.com/surya",
                    linkedin_url="https://linkedin.com/in/surya",
                    social_links={"x": "https://x.com/surya"},
                )
            )

        if db.query(Notification).count() == 0:
            db.add(Notification(type="system", title="Seed Complete", message="Initial seed data loaded", read=False))

        db.commit()
        print("Seed complete")
    finally:
        db.close()


if __name__ == "__main__":
    run_seed()
