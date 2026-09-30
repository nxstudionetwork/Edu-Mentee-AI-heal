from fastapi import APIRouter, Depends, Query, Path, Body
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime

from app.database import get_db
from app.dependencies import get_current_user, get_current_teacher
from app.core.exceptions import NotFoundException, BadRequestException, ConflictException
from app.models import User, Subject
from app.models.learning_path import LearningPath, LearningPathStep, UserLearningPath
from app.schemas.learning_path import (
    LearningPathCreate, LearningPathResponse, LearningPathDetailResponse,
    LearningPathStepResponse, UserLearningPathResponse,
)

router = APIRouter(prefix="/api/v1/learning-paths", tags=["Learning Paths"])


def _step_to_response(step: LearningPathStep) -> dict:
    return LearningPathStepResponse(
        id=step.id,
        uid=step.uid,
        title=step.title,
        description=step.description,
        step_order=step.step_order,
        content_type=step.content_type,
        content_id=step.content_id,
        estimated_minutes=step.estimated_minutes,
        is_optional=step.is_optional,
        is_active=step.is_active,
        created_at=step.created_at,
    ).model_dump()


def _path_to_response(lp: LearningPath) -> dict:
    return LearningPathResponse(
        id=lp.id,
        uid=lp.uid,
        title=lp.title,
        description=lp.description,
        subject_id=lp.subject_id,
        grade_level=lp.grade_level,
        difficulty=lp.difficulty,
        estimated_duration_days=lp.estimated_duration_days,
        total_steps=lp.total_steps,
        is_active=lp.is_active,
        created_at=lp.created_at,
    ).model_dump()


def _enrollment_to_response(ulp: UserLearningPath, total_steps: int) -> dict:
    progress = (ulp.current_step / total_steps * 100) if total_steps > 0 else 0
    return UserLearningPathResponse(
        id=ulp.id,
        uid=ulp.uid,
        learning_path_id=ulp.learning_path_id,
        current_step=ulp.current_step,
        is_completed=ulp.is_completed,
        progress_percent=round(progress, 2),
        started_at=ulp.started_at,
        completed_at=ulp.completed_at,
    ).model_dump()


@router.get("/recommended")
def get_recommended_paths(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get recommended learning paths for the current user."""
    paths = db.query(LearningPath).filter(LearningPath.is_active == True).order_by(LearningPath.created_at.desc()).limit(10).all()
    enrolled_ids = set()
    enrollments = db.query(UserLearningPath).filter(UserLearningPath.user_id == current_user.id).all()
    for e in enrollments:
        enrolled_ids.add(e.learning_path_id)

    recommended = [p for p in paths if p.id not in enrolled_ids][:6]
    return {
        "status": "success",
        "message": "Recommended learning paths retrieved successfully",
        "data": [_path_to_response(p) for p in recommended],
    }


@router.get("/my-paths")
def get_my_paths(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get user's enrolled learning paths with progress."""
    enrollments = db.query(UserLearningPath).filter(
        UserLearningPath.user_id == current_user.id,
    ).order_by(UserLearningPath.started_at.desc()).all()

    result = []
    for ulp in enrollments:
        lp = db.query(LearningPath).filter(LearningPath.id == ulp.learning_path_id).first()
        if lp:
            data = _enrollment_to_response(ulp, lp.total_steps)
            data["learning_path"] = _path_to_response(lp)
            result.append(data)

    return {
        "status": "success",
        "message": "My learning paths retrieved successfully",
        "data": result,
    }


@router.get("/")
def list_learning_paths(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    subject_id: Optional[int] = Query(None),
    grade_level: Optional[str] = Query(None),
    difficulty: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List learning paths with optional filtering."""
    query = db.query(LearningPath).filter(LearningPath.is_active == True)

    if subject_id:
        query = query.filter(LearningPath.subject_id == subject_id)
    if grade_level:
        query = query.filter(LearningPath.grade_level == grade_level)
    if difficulty:
        query = query.filter(LearningPath.difficulty == difficulty)
    if search:
        query = query.filter(
            (LearningPath.title.ilike(f"%{search}%")) |
            (LearningPath.description.ilike(f"%{search}%"))
        )

    total = query.count()
    paths = query.order_by(LearningPath.created_at.desc()).offset((page - 1) * per_page).limit(per_page).all()

    return {
        "status": "success",
        "message": "Learning paths retrieved successfully",
        "data": [_path_to_response(p) for p in paths],
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": (total + per_page - 1) // per_page,
    }


@router.get("/{path_id}")
def get_learning_path(
    path_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get learning path detail with all steps."""
    lp = db.query(LearningPath).filter(LearningPath.id == path_id, LearningPath.is_active == True).first()
    if not lp:
        raise NotFoundException(detail="Learning path not found")

    steps = db.query(LearningPathStep).filter(
        LearningPathStep.learning_path_id == lp.id,
        LearningPathStep.is_active == True,
    ).order_by(LearningPathStep.step_order.asc()).all()

    data = _path_to_response(lp)
    data["steps"] = [_step_to_response(s) for s in steps]

    return {
        "status": "success",
        "message": "Learning path retrieved successfully",
        "data": data,
    }


@router.post("/")
def create_learning_path(
    path_data: LearningPathCreate,
    current_user: User = Depends(get_current_teacher),
    db: Session = Depends(get_db),
):
    """Create a new learning path (teacher/admin only)."""
    from app.utils.id_generator import generate_id

    uid = generate_id("LP")
    new_path = LearningPath(
        uid=uid,
        title=path_data.title,
        description=path_data.description,
        subject_id=path_data.subject_id,
        grade_level=path_data.grade_level,
        difficulty=path_data.difficulty,
        estimated_duration_days=path_data.estimated_duration_days,
        total_steps=len(path_data.steps),
        is_active=True,
    )
    db.add(new_path)
    db.flush()

    for idx, step_data in enumerate(path_data.steps):
        step_uid = generate_id("LPS")
        step = LearningPathStep(
            uid=step_uid,
            learning_path_id=new_path.id,
            title=step_data.title,
            description=step_data.description,
            step_order=step_data.step_order if step_data.step_order else idx + 1,
            content_type=step_data.content_type,
            content_id=step_data.content_id,
            estimated_minutes=step_data.estimated_minutes,
            is_optional=step_data.is_optional,
            is_active=True,
        )
        db.add(step)

    db.commit()
    db.refresh(new_path)

    return {
        "status": "success",
        "message": "Learning path created successfully",
        "data": _path_to_response(new_path),
    }


@router.put("/{path_id}")
def update_learning_path(
    path_id: int = Path(...),
    path_data: LearningPathCreate = Body(...),
    current_user: User = Depends(get_current_teacher),
    db: Session = Depends(get_db),
):
    """Update a learning path (teacher/admin only)."""
    lp = db.query(LearningPath).filter(LearningPath.id == path_id).first()
    if not lp:
        raise NotFoundException(detail="Learning path not found")

    lp.title = path_data.title
    lp.description = path_data.description
    lp.subject_id = path_data.subject_id
    lp.grade_level = path_data.grade_level
    lp.difficulty = path_data.difficulty
    lp.estimated_duration_days = path_data.estimated_duration_days
    lp.updated_at = datetime.utcnow()

    if path_data.steps:
        db.query(LearningPathStep).filter(
            LearningPathStep.learning_path_id == lp.id
        ).delete()
        for idx, step_data in enumerate(path_data.steps):
            from app.utils.id_generator import generate_id
            step_uid = generate_id("LPS")
            step = LearningPathStep(
                uid=step_uid,
                learning_path_id=lp.id,
                title=step_data.title,
                description=step_data.description,
                step_order=step_data.step_order if step_data.step_order else idx + 1,
                content_type=step_data.content_type,
                content_id=step_data.content_id,
                estimated_minutes=step_data.estimated_minutes,
                is_optional=step_data.is_optional,
                is_active=True,
            )
            db.add(step)
        lp.total_steps = len(path_data.steps)

    db.commit()
    db.refresh(lp)

    return {
        "status": "success",
        "message": "Learning path updated successfully",
        "data": _path_to_response(lp),
    }


@router.delete("/{path_id}")
def delete_learning_path(
    path_id: int = Path(...),
    current_user: User = Depends(get_current_teacher),
    db: Session = Depends(get_db),
):
    """Soft-delete a learning path (teacher/admin only)."""
    lp = db.query(LearningPath).filter(LearningPath.id == path_id).first()
    if not lp:
        raise NotFoundException(detail="Learning path not found")

    lp.is_active = False
    lp.updated_at = datetime.utcnow()
    db.commit()

    return {
        "status": "success",
        "message": "Learning path deleted successfully",
        "data": None,
    }


@router.post("/{path_id}/enroll")
def enroll_in_path(
    path_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """User enrolls in a learning path."""
    lp = db.query(LearningPath).filter(LearningPath.id == path_id, LearningPath.is_active == True).first()
    if not lp:
        raise NotFoundException(detail="Learning path not found")

    existing = db.query(UserLearningPath).filter(
        UserLearningPath.user_id == current_user.id,
        UserLearningPath.learning_path_id == path_id,
    ).first()
    if existing:
        raise ConflictException(detail="Already enrolled in this learning path")

    from app.utils.id_generator import generate_id
    ulp = UserLearningPath(
        uid=generate_id("ULP"),
        user_id=current_user.id,
        learning_path_id=path_id,
        current_step=0,
        is_completed=False,
    )
    db.add(ulp)
    db.commit()
    db.refresh(ulp)

    return {
        "status": "success",
        "message": "Enrolled in learning path successfully",
        "data": _enrollment_to_response(ulp, lp.total_steps),
    }


@router.patch("/{path_id}/progress")
def update_progress(
    path_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update current step (increment progress)."""
    lp = db.query(LearningPath).filter(LearningPath.id == path_id, LearningPath.is_active == True).first()
    if not lp:
        raise NotFoundException(detail="Learning path not found")

    ulp = db.query(UserLearningPath).filter(
        UserLearningPath.user_id == current_user.id,
        UserLearningPath.learning_path_id == path_id,
    ).first()
    if not ulp:
        raise BadRequestException(detail="Not enrolled in this learning path")

    if ulp.is_completed:
        raise BadRequestException(detail="Learning path already completed")

    if ulp.current_step < lp.total_steps:
        ulp.current_step += 1

    if ulp.current_step >= lp.total_steps:
        ulp.is_completed = True
        ulp.completed_at = datetime.utcnow()

    db.commit()
    db.refresh(ulp)

    return {
        "status": "success",
        "message": "Progress updated successfully",
        "data": _enrollment_to_response(ulp, lp.total_steps),
    }


@router.post("/{path_id}/complete")
def complete_path(
    path_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Mark path as completed for user."""
    lp = db.query(LearningPath).filter(LearningPath.id == path_id, LearningPath.is_active == True).first()
    if not lp:
        raise NotFoundException(detail="Learning path not found")

    ulp = db.query(UserLearningPath).filter(
        UserLearningPath.user_id == current_user.id,
        UserLearningPath.learning_path_id == path_id,
    ).first()
    if not ulp:
        raise BadRequestException(detail="Not enrolled in this learning path")

    ulp.current_step = lp.total_steps
    ulp.is_completed = True
    ulp.completed_at = datetime.utcnow()
    db.commit()
    db.refresh(ulp)

    return {
        "status": "success",
        "message": "Learning path marked as completed",
        "data": _enrollment_to_response(ulp, lp.total_steps),
    }
