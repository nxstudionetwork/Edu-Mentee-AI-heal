from fastapi import APIRouter, Depends, Query, Path
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime

from app.database import get_db
from app.dependencies import get_current_user
from app.core.exceptions import NotFoundException
from app.models import User, Topic, Lesson
from app.schemas import TopicResponse

router = APIRouter(prefix="/api/v1/contents", tags=["Contents"])


def _topic_to_response(topic: Topic) -> dict:
    return TopicResponse(
        id=topic.id,
        uid=topic.uid,
        lesson_id=topic.lesson_id,
        title=topic.title,
        content=topic.content,
        order_index=topic.order_index,
        duration_minutes=topic.duration_minutes,
        is_completed=topic.is_completed,
        created_at=topic.created_at,
    ).model_dump()


@router.get("/topics")
def list_topics(
    page: int = Query(1, ge=1),
    per_page: int = Query(50, ge=1, le=100),
    lesson_id: Optional[int] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List topics with optional filtering by lesson_id."""
    query = db.query(Topic)

    if lesson_id:
        query = query.filter(Topic.lesson_id == lesson_id)

    total = query.count()
    topics = query.order_by(Topic.order_index.asc()).offset((page - 1) * per_page).limit(per_page).all()

    return {
        "status": "success",
        "message": "Topics retrieved successfully",
        "data": [_topic_to_response(t) for t in topics],
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": (total + per_page - 1) // per_page,
    }


@router.get("/topics/{topic_id}")
def get_topic(
    topic_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get topic detail."""
    topic = db.query(Topic).filter(Topic.id == topic_id).first()
    if not topic:
        raise NotFoundException(detail="Topic not found")

    return {
        "status": "success",
        "message": "Topic retrieved successfully",
        "data": _topic_to_response(topic),
    }


@router.put("/topics/{topic_id}/complete")
def mark_topic_complete(
    topic_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Mark topic as completed for the current user."""
    topic = db.query(Topic).filter(Topic.id == topic_id).first()
    if not topic:
        raise NotFoundException(detail="Topic not found")

    topic.is_completed = True
    topic.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(topic)

    return {
        "status": "success",
        "message": "Topic marked as completed",
        "data": _topic_to_response(topic),
    }
