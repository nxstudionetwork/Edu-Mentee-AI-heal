from fastapi import APIRouter, Depends, Query, Path
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime

from app.database import get_db
from app.dependencies import get_current_user
from app.core.exceptions import NotFoundException
from app.models import User, Notification
from app.schemas import NotificationResponse

router = APIRouter(prefix="/api/v1/notifications", tags=["Notifications"])


@router.get("/unread-count")
def get_unread_count(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get unread notification count."""
    count = db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.is_read == False,
    ).count()

    return {
        "status": "success",
        "message": "Unread count retrieved",
        "data": {"count": count},
    }


@router.get("/")
def list_notifications(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    is_read: Optional[bool] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get user's notifications with optional is_read filter."""
    query = db.query(Notification).filter(Notification.user_id == current_user.id)

    if is_read is not None:
        query = query.filter(Notification.is_read == is_read)

    total = query.count()
    notifications = query.order_by(Notification.created_at.desc()).offset((page - 1) * per_page).limit(per_page).all()

    return {
        "status": "success",
        "message": "Notifications retrieved successfully",
        "data": [
            {
                "id": n.id,
                "uid": n.uid,
                "title": n.title,
                "body": n.body,
                "type": n.type,
                "reference_type": n.reference_type,
                "reference_id": n.reference_id,
                "is_read": n.is_read,
                "created_at": n.created_at.isoformat() if n.created_at else None,
            }
            for n in notifications
        ],
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": (total + per_page - 1) // per_page,
    }


@router.patch("/{notification_id}/read")
def mark_as_read(
    notification_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Mark a notification as read."""
    notification = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == current_user.id,
    ).first()
    if not notification:
        raise NotFoundException(detail="Notification not found")

    notification.is_read = True
    notification.updated_at = datetime.utcnow()
    db.commit()

    return {
        "status": "success",
        "message": "Notification marked as read",
        "data": None,
    }


@router.patch("/read-all")
def mark_all_as_read(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Mark all notifications as read."""
    db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.is_read == False,
    ).update({"is_read": True, "updated_at": datetime.utcnow()})
    db.commit()

    return {
        "status": "success",
        "message": "All notifications marked as read",
        "data": None,
    }


@router.delete("/{notification_id}")
def delete_notification(
    notification_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a notification."""
    notification = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == current_user.id,
    ).first()
    if not notification:
        raise NotFoundException(detail="Notification not found")

    db.delete(notification)
    db.commit()

    return {
        "status": "success",
        "message": "Notification deleted successfully",
        "data": None,
    }
