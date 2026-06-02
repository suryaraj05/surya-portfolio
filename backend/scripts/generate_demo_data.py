from datetime import datetime, timedelta, timezone
import random
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from app.db.session import SessionLocal
from app.models.entities import Event, Visitor


EVENT_TYPES = ["github_click", "linkedin_click", "demo_click", "project_viewed", "resume_download", "page_view"]


def generate_demo_data(visitor_count: int = 50, event_count: int = 300) -> None:
    db = SessionLocal()
    try:
        visitors = []
        now = datetime.now(timezone.utc)
        for i in range(visitor_count):
            visitor = Visitor(
                session_id=f"demo_session_{i}",
                ip_hash=f"demo_hash_{i}",
                country=random.choice(["IN", "US", "DE"]),
                city=random.choice(["Bengaluru", "Mumbai", "Berlin", "NYC"]),
                device=random.choice(["mobile", "desktop"]),
                browser=random.choice(["chrome", "firefox", "safari"]),
                os=random.choice(["android", "ios", "windows", "linux"]),
                referrer=random.choice(["google", "linkedin", "github"]),
                landing_page=random.choice(["/", "/projects", "/blog"]),
                first_seen=now - timedelta(days=random.randint(1, 30)),
                last_seen=now - timedelta(minutes=random.randint(0, 120)),
            )
            visitors.append(visitor)
            db.add(visitor)
        db.commit()

        for _ in range(event_count):
            visitor = random.choice(visitors)
            event_time = now - timedelta(hours=random.randint(0, 168))
            db.add(
                Event(
                    event_type=random.choice(EVENT_TYPES),
                    entity_type="visitor",
                    entity_id=str(visitor.id),
                    visitor_id=visitor.session_id,
                    project_id=None,
                    event_metadata={"demo": True},
                    timestamp=event_time,
                    country=visitor.country,
                    device=visitor.device,
                    browser=visitor.browser,
                    referrer=visitor.referrer,
                )
            )
        db.commit()
        print(f"Generated {visitor_count} visitors and {event_count} events")
    finally:
        db.close()


if __name__ == "__main__":
    generate_demo_data()
