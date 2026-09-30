from fastapi import APIRouter, Depends, Query, Path, Body
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime

from app.database import get_db
from app.dependencies import get_current_user, get_current_teacher
from app.core.exceptions import NotFoundException, BadRequestException, ForbiddenException
from app.models import User, Subject, Lesson, Topic
from app.schemas import SubjectCreate, SubjectUpdate, SubjectResponse

router = APIRouter(prefix="/api/v1/subjects", tags=["Subjects"])


def _subject_to_response(subject: Subject) -> dict:
    return SubjectResponse(
        id=subject.id,
        uid=subject.uid,
        name=subject.name,
        code=subject.code,
        description=subject.description,
        icon=subject.icon,
        color=subject.color,
        class_name=subject.class_name,
        stream=subject.stream,
        is_active=subject.is_active,
        created_at=subject.created_at,
    ).model_dump()


@router.get("/")
def list_subjects(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    class_name: Optional[str] = Query(None),
    stream: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List subjects with optional filtering by class, stream, and search query."""
    query = db.query(Subject).filter(Subject.is_active == True)

    if class_name:
        query = query.filter(Subject.class_name == class_name)
    if stream:
        query = query.filter(Subject.stream == stream)
    if search:
        query = query.filter(
            (Subject.name.ilike(f"%{search}%")) |
            (Subject.code.ilike(f"%{search}%")) |
            (Subject.description.ilike(f"%{search}%"))
        )

    total = query.count()
    subjects = query.order_by(Subject.order_index.asc()).offset((page - 1) * per_page).limit(per_page).all()

    return {
        "status": "success",
        "message": "Subjects retrieved successfully",
        "data": [_subject_to_response(s) for s in subjects],
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": (total + per_page - 1) // per_page,
    }


@router.get("/{subject_id}")
def get_subject(
    subject_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get subject detail with its lessons."""
    subject = db.query(Subject).filter(Subject.id == subject_id, Subject.is_active == True).first()
    if not subject:
        raise NotFoundException(detail="Subject not found")

    lessons = db.query(Lesson).filter(
        Lesson.subject_id == subject.id,
        Lesson.is_active == True,
    ).order_by(Lesson.order_index.asc()).all()

    return {
        "status": "success",
        "message": "Subject retrieved successfully",
        "data": {
            **_subject_to_response(subject),
            "lessons": [
                {
                    "id": l.id,
                    "uid": l.uid,
                    "title": l.title,
                    "description": l.description,
                    "order_index": l.order_index,
                    "duration_minutes": l.duration_minutes,
                }
                for l in lessons
            ],
        },
    }


@router.post("/")
def create_subject(
    subject_data: SubjectCreate,
    current_user: User = Depends(get_current_teacher),
    db: Session = Depends(get_db),
):
    """Create a new subject (teacher/admin only)."""
    existing = db.query(Subject).filter(Subject.code == subject_data.code).first()
    if existing:
        from app.core.exceptions import ConflictException
        raise ConflictException(detail="Subject code already exists")

    from app.utils.id_generator import generate_id
    uid = generate_id("SUBJ")
    new_subject = Subject(
        uid=uid,
        name=subject_data.name,
        code=subject_data.code,
        description=subject_data.description,
        icon=subject_data.icon,
        color=subject_data.color,
        class_name=subject_data.class_name,
        stream=subject_data.stream,
        is_active=True,
    )
    db.add(new_subject)
    db.commit()
    db.refresh(new_subject)

    return {
        "status": "success",
        "message": "Subject created successfully",
        "data": _subject_to_response(new_subject),
    }


@router.put("/{subject_id}")
def update_subject(
    subject_id: int = Path(...),
    subject_data: SubjectUpdate = Body(...),
    current_user: User = Depends(get_current_teacher),
    db: Session = Depends(get_db),
):
    """Update a subject (teacher/admin only)."""
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not subject:
        raise NotFoundException(detail="Subject not found")

    update_dict = subject_data.model_dump(exclude_unset=True)
    for field, value in update_dict.items():
        setattr(subject, field, value)
    subject.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(subject)

    return {
        "status": "success",
        "message": "Subject updated successfully",
        "data": _subject_to_response(subject),
    }


@router.delete("/{subject_id}")
def delete_subject(
    subject_id: int = Path(...),
    current_user: User = Depends(get_current_teacher),
    db: Session = Depends(get_db),
):
    """Soft-delete a subject (teacher/admin only)."""
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not subject:
        raise NotFoundException(detail="Subject not found")

    subject.is_active = False
    subject.updated_at = datetime.utcnow()
    db.commit()

    return {
        "status": "success",
        "message": "Subject deleted successfully",
        "data": None,
    }


@router.get("/{subject_id}/progress")
def get_subject_progress(
    subject_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get user's progress in a specific subject."""
    subject = db.query(Subject).filter(Subject.id == subject_id, Subject.is_active == True).first()
    if not subject:
        raise NotFoundException(detail="Subject not found")

    total_topics = db.query(Topic).join(Lesson).filter(
        Lesson.subject_id == subject_id,
    ).count()

    completed_topics = db.query(Topic).join(Lesson).filter(
        Lesson.subject_id == subject_id,
        Topic.is_completed == True,
    ).count()

    total_lessons = db.query(Lesson).filter(
        Lesson.subject_id == subject_id,
        Lesson.is_active == True,
    ).count()

    progress_percentage = (completed_topics / total_topics * 100) if total_topics > 0 else 0

    return {
        "status": "success",
        "message": "Subject progress retrieved successfully",
        "data": {
            "subject_id": subject.id,
            "subject_uid": subject.uid,
            "total_lessons": total_lessons,
            "total_topics": total_topics,
            "completed_topics": completed_topics,
            "progress_percentage": round(progress_percentage, 2),
        },
    }
