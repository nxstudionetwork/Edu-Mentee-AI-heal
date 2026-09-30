from fastapi import APIRouter, Depends, Path, Body
from sqlalchemy.orm import Session
from datetime import datetime

from app.database import get_db
from app.dependencies import get_current_user
from app.core.exceptions import NotFoundException, BadRequestException
from app.models import User, ExamResult, Exam, QuizAttempt, Quiz
from app.utils.id_generator import generate_id

router = APIRouter(prefix="/api/v1/certificates", tags=["Certificates"])


@router.get("/")
def list_certificates(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List user's certificates."""
    return {
        "status": "success",
        "message": "Certificates retrieved successfully",
        "data": [],
    }


@router.get("/{certificate_id}")
def get_certificate(
    certificate_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get certificate detail."""
    raise NotFoundException(detail="Certificate not found")


@router.post("/generate")
def generate_certificate(
    course_id: int = Body(None, embed=True),
    exam_id: int = Body(None, embed=True),
    certificate_type: str = Body(..., embed=True),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Generate certificate for completed course/exam."""
    if not course_id and not exam_id:
        raise BadRequestException(detail="Either course_id or exam_id is required")

    cert_uid = generate_id("CERT")
    title = ""

    if exam_id:
        exam = db.query(Exam).filter(Exam.id == exam_id).first()
        if not exam:
            raise NotFoundException(detail="Exam not found")

        result = db.query(ExamResult).filter(
            ExamResult.exam_id == exam_id,
            ExamResult.user_id == current_user.id,
            ExamResult.is_passed == True,
        ).first()
        if not result:
            raise BadRequestException(detail="You have not passed this exam")

        title = f"Certificate of Achievement - {exam.title}"

    if course_id:
        title = f"Certificate of Completion - Course {course_id}"

    return {
        "status": "success",
        "message": "Certificate generated successfully",
        "data": {
            "uid": cert_uid,
            "title": title,
            "user_name": current_user.full_name,
            "issued_at": datetime.utcnow().isoformat(),
            "certificate_url": f"/certificates/{cert_uid}",
            "type": certificate_type,
        },
    }
