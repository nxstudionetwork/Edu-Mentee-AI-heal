from fastapi import APIRouter, Depends, Query, Path, Body
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime

from app.database import get_db
from app.dependencies import get_current_user
from app.core.exceptions import NotFoundException, BadRequestException
from app.models import User, CalendarEvent
from app.schemas import CalendarEventCreate, CalendarEventUpdate, CalendarEventResponse
from app.utils.id_generator import generate_id

router = APIRouter(prefix="/api/v1/calendar", tags=["Calendar"])


@router.get("/")
def get_calendar_events(
    start_date: Optional[str] = Query(None, description="Start date ISO format"),
    end_date: Optional[str] = Query(None, description="End date ISO format"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get calendar events filtered by date range."""
    query = db.query(CalendarEvent).filter(CalendarEvent.user_id == current_user.id)

    if start_date:
        try:
            start = datetime.fromisoformat(start_date.replace("Z", "+00:00"))
            query = query.filter(CalendarEvent.event_date >= start)
        except ValueError:
            raise BadRequestException(detail="Invalid start_date format")

    if end_date:
        try:
            end = datetime.fromisoformat(end_date.replace("Z", "+00:00"))
            query = query.filter(CalendarEvent.event_date <= end)
        except ValueError:
            raise BadRequestException(detail="Invalid end_date format")

    events = query.order_by(CalendarEvent.event_date.asc()).all()

    return {
        "status": "success",
        "message": "Calendar events retrieved successfully",
        "data": [
            {
                "id": e.id,
                "uid": e.uid,
                "title": e.title,
                "description": e.description,
                "event_date": e.event_date.isoformat() if e.event_date else None,
                "start_time": e.start_time.isoformat() if e.start_time else None,
                "end_time": e.end_time.isoformat() if e.end_time else None,
                "color": e.color,
                "event_type": e.event_type.value if hasattr(e.event_type, 'value') else e.event_type,
                "is_all_day": e.is_all_day,
                "is_recurring": e.is_recurring,
                "created_at": e.created_at.isoformat() if e.created_at else None,
            }
            for e in events
        ],
    }


@router.post("/")
def create_event(
    data: CalendarEventCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new calendar event."""
    event = CalendarEvent(
        uid=generate_id("EVT"),
        user_id=current_user.id,
        title=data.title,
        description=data.description,
        event_date=data.event_date,
        color=data.color,
        event_type=data.event_type,
        is_all_day=data.is_all_day,
    )
    db.add(event)
    db.commit()
    db.refresh(event)

    return {
        "status": "success",
        "message": "Event created successfully",
        "data": {
            "id": event.id,
            "uid": event.uid,
            "title": event.title,
            "description": event.description,
            "event_date": event.event_date.isoformat() if event.event_date else None,
            "color": event.color,
            "event_type": event.event_type.value if hasattr(event.event_type, 'value') else event.event_type,
            "is_all_day": event.is_all_day,
            "created_at": event.created_at.isoformat() if event.created_at else None,
        },
    }


@router.put("/{event_id}")
def update_event(
    event_id: int = Path(...),
    data: CalendarEventUpdate = Body(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update a calendar event."""
    event = db.query(CalendarEvent).filter(
        CalendarEvent.id == event_id,
        CalendarEvent.user_id == current_user.id,
    ).first()
    if not event:
        raise NotFoundException(detail="Event not found")

    update_dict = data.model_dump(exclude_unset=True)
    for field, value in update_dict.items():
        setattr(event, field, value)
    event.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(event)

    return {
        "status": "success",
        "message": "Event updated successfully",
        "data": {
            "id": event.id,
            "uid": event.uid,
            "title": event.title,
            "description": event.description,
            "event_date": event.event_date.isoformat() if event.event_date else None,
            "color": event.color,
            "event_type": event.event_type.value if hasattr(event.event_type, 'value') else event.event_type,
            "is_all_day": event.is_all_day,
        },
    }


@router.delete("/{event_id}")
def delete_event(
    event_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a calendar event."""
    event = db.query(CalendarEvent).filter(
        CalendarEvent.id == event_id,
        CalendarEvent.user_id == current_user.id,
    ).first()
    if not event:
        raise NotFoundException(detail="Event not found")

    db.delete(event)
    db.commit()

    return {
        "status": "success",
        "message": "Event deleted successfully",
        "data": None,
    }
