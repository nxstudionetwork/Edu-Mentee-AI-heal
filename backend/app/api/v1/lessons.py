from fastapi import APIRouter, Depends, Query, Path, Body
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime

from app.database import get_db
from app.dependencies import get_current_user, get_current_teacher
from app.core.exceptions import NotFoundException, BadRequestException, ForbiddenException
from app.models import User, Lesson, Subject, Topic
from app.schemas import LessonCreate, LessonUpdate, LessonResponse

router = APIRouter(prefix="/api/v1/lessons", tags=["Lessons"])


def _lesson_to_response(lesson: Lesson) -> dict:
    return LessonResponse(
        id=lesson.id,
        uid=lesson.uid,
        subject_id=lesson.subject_id,
        title=lesson.title,
        description=lesson.description,
        order_index=lesson.order_index,
        duration_minutes=lesson.duration_minutes,
        is_active=lesson.is_active,
        created_at=lesson.created_at,
    ).model_dump()


@router.get("/")
def list_lessons(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    subject_id: Optional[int] = Query(None),
    search: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List lessons with optional filtering by subject_id."""
    query = db.query(Lesson).filter(Lesson.is_active == True)

    if subject_id:
        query = query.filter(Lesson.subject_id == subject_id)
    if search:
        query = query.filter(
            (Lesson.title.ilike(f"%{search}%")) |
            (Lesson.description.ilike(f"%{search}%"))
        )

    total = query.count()
    lessons = query.order_by(Lesson.order_index.asc()).offset((page - 1) * per_page).limit(per_page).all()

    return {
        "status": "success",
        "message": "Lessons retrieved successfully",
        "data": [_lesson_to_response(l) for l in lessons],
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": (total + per_page - 1) // per_page,
    }


@router.get("/{lesson_id}")
def get_lesson(
    lesson_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get lesson detail with topics."""
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id, Lesson.is_active == True).first()
    if not lesson:
        raise NotFoundException(detail="Lesson not found")

    topics = db.query(Topic).filter(
        Topic.lesson_id == lesson.id,
    ).order_by(Topic.order_index.asc()).all()

    return {
        "status": "success",
        "message": "Lesson retrieved successfully",
        "data": {
            **_lesson_to_response(lesson),
            "topics": [
                {
                    "id": t.id,
                    "uid": t.uid,
                    "title": t.title,
                    "content": t.content,
                    "order_index": t.order_index,
                    "duration_minutes": t.duration_minutes,
                    "is_completed": t.is_completed,
                }
                for t in topics
            ],
        },
    }


@router.post("/")
def create_lesson(
    lesson_data: LessonCreate,
    current_user: User = Depends(get_current_teacher),
    db: Session = Depends(get_db),
):
    """Create a new lesson (teacher/admin only)."""
    subject = db.query(Subject).filter(Subject.id == lesson_data.subject_id).first()
    if not subject:
        raise NotFoundException(detail="Subject not found")

    from app.utils.id_generator import generate_id
    uid = generate_id("LESS")
    new_lesson = Lesson(
        uid=uid,
        subject_id=lesson_data.subject_id,
        title=lesson_data.title,
        description=lesson_data.description,
        order_index=lesson_data.order_index,
        duration_minutes=lesson_data.duration_minutes,
        content=lesson_data.content,
        is_active=True,
    )
    db.add(new_lesson)
    db.commit()
    db.refresh(new_lesson)

    return {
        "status": "success",
        "message": "Lesson created successfully",
        "data": _lesson_to_response(new_lesson),
    }


@router.put("/{lesson_id}")
def update_lesson(
    lesson_id: int = Path(...),
    lesson_data: LessonUpdate = Body(...),
    current_user: User = Depends(get_current_teacher),
    db: Session = Depends(get_db),
):
    """Update a lesson (teacher/admin only)."""
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise NotFoundException(detail="Lesson not found")

    update_dict = lesson_data.model_dump(exclude_unset=True)
    for field, value in update_dict.items():
        setattr(lesson, field, value)
    lesson.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(lesson)

    return {
        "status": "success",
        "message": "Lesson updated successfully",
        "data": _lesson_to_response(lesson),
    }


@router.delete("/{lesson_id}")
def delete_lesson(
    lesson_id: int = Path(...),
    current_user: User = Depends(get_current_teacher),
    db: Session = Depends(get_db),
):
    """Soft-delete a lesson (teacher/admin only)."""
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise NotFoundException(detail="Lesson not found")

    lesson.is_active = False
    lesson.updated_at = datetime.utcnow()
    db.commit()

    return {
        "status": "success",
        "message": "Lesson deleted successfully",
        "data": None,
    }


@router.get("/{lesson_id}/progress")
def get_lesson_progress(
    lesson_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get user's progress in a specific lesson."""
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id, Lesson.is_active == True).first()
    if not lesson:
        raise NotFoundException(detail="Lesson not found")

    total_topics = db.query(Topic).filter(Topic.lesson_id == lesson_id).count()
    completed_topics = db.query(Topic).filter(
        Topic.lesson_id == lesson_id,
        Topic.is_completed == True,
    ).count()

    progress_percentage = (completed_topics / total_topics * 100) if total_topics > 0 else 0

    return {
        "status": "success",
        "message": "Lesson progress retrieved successfully",
        "data": {
            "lesson_id": lesson.id,
            "lesson_uid": lesson.uid,
            "total_topics": total_topics,
            "completed_topics": completed_topics,
            "progress_percentage": round(progress_percentage, 2),
        },
    }
