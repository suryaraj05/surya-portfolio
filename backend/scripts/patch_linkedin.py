"""Update site LinkedIn URL in existing databases."""

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from app.db.session import SessionLocal
from app.models.entities import Setting

LINKEDIN_URL = "https://www.linkedin.com/in/salve-surya-raj/"


def run() -> None:
    db = SessionLocal()
    try:
        row = db.query(Setting).first()
        if not row:
            row = Setting(site_title="SuryaOS", linkedin_url=LINKEDIN_URL)
            db.add(row)
        else:
            row.linkedin_url = LINKEDIN_URL
        db.commit()
        print(f"LinkedIn URL set to {LINKEDIN_URL}")
    finally:
        db.close()


if __name__ == "__main__":
    run()
