from sqlalchemy.orm import Session

from app.services.crud_service import create_notification


def queue_notification(db: Session, notification_type: str, title: str, message: str) -> None:
    # Placeholder sync task; can be moved to Celery/RQ worker later.
    create_notification(db, notification_type, title, message)
