from fastapi import APIRouter, Depends, Query, Path
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime

from app.database import get_db
from app.dependencies import get_current_user
from app.core.exceptions import NotFoundException, BadRequestException, ConflictException
from app.models import User, Exam, ExamRegistration, ExamResult, Subject
from app.schemas import ExamResponse, ExamResultResponse
from app.utils.id_generator import generate_id

router = APIRouter(prefix="/api/v1/exams", tags=["Exams"])


@router.get("/results")
def get_all_results(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all user's exam results."""
    results = db.query(ExamResult).filter(
        ExamResult.user_id == current_user.id,
    ).order_by(ExamResult.created_at.desc()).all()

    data = []
    for r in results:
        exam = db.query(Exam).filter(Exam.id == r.exam_id).first()
        data.append({
            "id": r.id,
            "uid": r.uid,
            "exam_id": r.exam_id,
            "exam_title": exam.title if exam else None,
            "marks_obtained": r.marks_obtained,
            "total_marks": r.total_marks,
            "percentage": r.percentage,
            "grade": r.grade,
            "rank": r.rank,
            "is_passed": r.is_passed,
            "completed_at": r.completed_at.isoformat() if r.completed_at else None,
        })

    return {
        "status": "success",
        "message": "Exam results retrieved successfully",
        "data": data,
    }


@router.get("/results/{result_id}")
def get_result_detail(
    result_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get specific exam result."""
    result = db.query(ExamResult).filter(
        ExamResult.id == result_id,
        ExamResult.user_id == current_user.id,
    ).first()
    if not result:
        raise NotFoundException(detail="Exam result not found")

    exam = db.query(Exam).filter(Exam.id == result.exam_id).first()

    return {
        "status": "success",
        "message": "Exam result retrieved successfully",
        "data": {
            "id": result.id,
            "uid": result.uid,
            "exam_id": result.exam_id,
            "exam_title": exam.title if exam else None,
            "marks_obtained": result.marks_obtained,
            "total_marks": result.total_marks,
            "percentage": result.percentage,
            "grade": result.grade,
            "rank": result.rank,
            "is_passed": result.is_passed,
            "completed_at": result.completed_at.isoformat() if result.completed_at else None,
        },
    }


@router.get("/")
def list_exams(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    subject_id: Optional[int] = Query(None),
    upcoming: Optional[bool] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List exams with optional filters for subject_id, upcoming/past."""
    query = db.query(Exam).filter(Exam.is_active == True)

    if subject_id:
        query = query.filter(Exam.subject_id == subject_id)

    now = datetime.utcnow()
    if upcoming is True:
        query = query.filter(Exam.exam_date > now)
    elif upcoming is False:
        query = query.filter(Exam.exam_date <= now)

    total = query.count()
    exams = query.order_by(Exam.exam_date.asc()).offset((page - 1) * per_page).limit(per_page).all()

    result = []
    for e in exams:
        registration = db.query(ExamRegistration).filter(
            ExamRegistration.exam_id == e.id,
            ExamRegistration.user_id == current_user.id,
        ).first()
        result.append({
            **ExamResponse(
                id=e.id, uid=e.uid, subject_id=e.subject_id, title=e.title,
                description=e.description, exam_date=e.exam_date,
                duration_minutes=e.duration_minutes, total_marks=e.total_marks,
                passing_marks=e.passing_marks, is_active=e.is_active,
                created_at=e.created_at,
            ).model_dump(),
            "is_registered": registration is not None,
        })

    return {
        "status": "success",
        "message": "Exams retrieved successfully",
        "data": result,
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": (total + per_page - 1) // per_page,
    }


@router.get("/{exam_id}")
def get_exam(
    exam_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get exam detail."""
    exam = db.query(Exam).filter(Exam.id == exam_id, Exam.is_active == True).first()
    if not exam:
        raise NotFoundException(detail="Exam not found")

    registration = db.query(ExamRegistration).filter(
        ExamRegistration.exam_id == exam.id,
        ExamRegistration.user_id == current_user.id,
    ).first()

    result = db.query(ExamResult).filter(
        ExamResult.exam_id == exam.id,
        ExamResult.user_id == current_user.id,
    ).first()

    return {
        "status": "success",
        "message": "Exam retrieved successfully",
        "data": {
            **ExamResponse(
                id=exam.id, uid=exam.uid, subject_id=exam.subject_id, title=exam.title,
                description=exam.description, exam_date=exam.exam_date,
                duration_minutes=exam.duration_minutes, total_marks=exam.total_marks,
                passing_marks=exam.passing_marks, is_active=exam.is_active,
                created_at=exam.created_at,
            ).model_dump(),
            "is_registered": registration is not None,
            "has_result": result is not None,
            "result": {
                "marks_obtained": result.marks_obtained,
                "percentage": result.percentage,
                "grade": result.grade,
                "is_passed": result.is_passed,
            } if result else None,
        },
    }


@router.post("/{exam_id}/register")
def register_for_exam(
    exam_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Register for an exam."""
    exam = db.query(Exam).filter(Exam.id == exam_id, Exam.is_active == True).first()
    if not exam:
        raise NotFoundException(detail="Exam not found")

    existing = db.query(ExamRegistration).filter(
        ExamRegistration.exam_id == exam_id,
        ExamRegistration.user_id == current_user.id,
    ).first()
    if existing:
        raise ConflictException(detail="Already registered for this exam")

    registration = ExamRegistration(
        uid=generate_id("EREG"),
        exam_id=exam_id,
        user_id=current_user.id,
    )
    db.add(registration)
    db.commit()
    db.refresh(registration)

    return {
        "status": "success",
        "message": "Registered for exam successfully",
        "data": {
            "registration_uid": registration.uid,
            "exam_id": exam.id,
            "exam_title": exam.title,
            "registered_at": registration.registered_at.isoformat() if registration.registered_at else None,
        },
    }


@router.get("/{exam_id}/results")
def get_exam_results(
    exam_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get exam results for the current user."""
    exam = db.query(Exam).filter(Exam.id == exam_id).first()
    if not exam:
        raise NotFoundException(detail="Exam not found")

    results = db.query(ExamResult).filter(
        ExamResult.exam_id == exam_id,
        ExamResult.user_id == current_user.id,
    ).all()

    return {
        "status": "success",
        "message": "Exam results retrieved successfully",
        "data": [
            {
                "id": r.id,
                "uid": r.uid,
                "marks_obtained": r.marks_obtained,
                "total_marks": r.total_marks,
                "percentage": r.percentage,
                "grade": r.grade,
                "rank": r.rank,
                "is_passed": r.is_passed,
                "completed_at": r.completed_at.isoformat() if r.completed_at else None,
            }
            for r in results
        ],
    }
