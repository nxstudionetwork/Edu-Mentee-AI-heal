from fastapi import APIRouter, Depends, Query, Path, Body
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime

from app.database import get_db
from app.dependencies import get_current_user, get_current_teacher
from app.core.exceptions import NotFoundException, BadRequestException, ForbiddenException
from app.models import User, Assignment, Submission, Teacher, Subject
from app.schemas import AssignmentCreate, AssignmentUpdate, AssignmentResponse, SubmissionCreate, GradeSubmission, SubmissionResponse
from app.utils.id_generator import generate_id

router = APIRouter(prefix="/api/v1/assignments", tags=["Assignments"])


@router.get("/")
def list_assignments(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    subject_id: Optional[int] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List assignments with optional subject filter."""
    query = db.query(Assignment).filter(Assignment.is_active == True)

    if subject_id:
        query = query.filter(Assignment.subject_id == subject_id)

    total = query.count()
    assignments = query.order_by(Assignment.due_date.asc()).offset((page - 1) * per_page).limit(per_page).all()

    result = []
    for a in assignments:
        submission = db.query(Submission).filter(
            Submission.assignment_id == a.id,
            Submission.user_id == current_user.id,
        ).first()
        result.append({
            **AssignmentResponse(
                id=a.id, uid=a.uid, subject_id=a.subject_id, teacher_id=a.teacher_id,
                title=a.title, description=a.description, due_date=a.due_date,
                total_marks=a.total_marks, is_active=a.is_active, created_at=a.created_at,
            ).model_dump(),
            "is_submitted": submission is not None,
            "submission": {
                "id": submission.id,
                "marks_obtained": submission.marks_obtained,
                "is_graded": submission.is_graded,
            } if submission else None,
        })

    return {
        "status": "success",
        "message": "Assignments retrieved successfully",
        "data": result,
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": (total + per_page - 1) // per_page,
    }


@router.get("/{assignment_id}")
def get_assignment(
    assignment_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get assignment detail."""
    assignment = db.query(Assignment).filter(
        Assignment.id == assignment_id, Assignment.is_active == True
    ).first()
    if not assignment:
        raise NotFoundException(detail="Assignment not found")

    submission = db.query(Submission).filter(
        Submission.assignment_id == assignment.id,
        Submission.user_id == current_user.id,
    ).first()

    return {
        "status": "success",
        "message": "Assignment retrieved successfully",
        "data": {
            **AssignmentResponse(
                id=assignment.id, uid=assignment.uid, subject_id=assignment.subject_id,
                teacher_id=assignment.teacher_id, title=assignment.title,
                description=assignment.description, due_date=assignment.due_date,
                total_marks=assignment.total_marks, is_active=assignment.is_active,
                created_at=assignment.created_at,
            ).model_dump(),
            "submission": SubmissionResponse(
                id=submission.id, uid=submission.uid, assignment_id=submission.assignment_id,
                user_id=submission.user_id, file_url=submission.file_url, content=submission.content,
                marks_obtained=submission.marks_obtained, feedback=submission.feedback,
                is_graded=submission.is_graded, submitted_at=submission.submitted_at,
            ).model_dump() if submission else None,
        },
    }


@router.post("/")
def create_assignment(
    data: AssignmentCreate,
    current_user: User = Depends(get_current_teacher),
    db: Session = Depends(get_db),
):
    """Create a new assignment (teacher only)."""
    subject = db.query(Subject).filter(Subject.id == data.subject_id).first()
    if not subject:
        raise NotFoundException(detail="Subject not found")

    teacher = db.query(Teacher).filter(Teacher.user_id == current_user.id).first()
    if not teacher and current_user.role.value != "admin":
        raise ForbiddenException(detail="Teacher profile not found")

    assignment = Assignment(
        uid=generate_id("ASGN"),
        subject_id=data.subject_id,
        teacher_id=teacher.id if teacher else 0,
        title=data.title,
        description=data.description,
        due_date=data.due_date,
        total_marks=data.total_marks,
        file_url=data.file_url,
        is_active=True,
    )
    db.add(assignment)
    db.commit()
    db.refresh(assignment)

    return {
        "status": "success",
        "message": "Assignment created successfully",
        "data": AssignmentResponse(
            id=assignment.id, uid=assignment.uid, subject_id=assignment.subject_id,
            teacher_id=assignment.teacher_id, title=assignment.title,
            description=assignment.description, due_date=assignment.due_date,
            total_marks=assignment.total_marks, is_active=assignment.is_active,
            created_at=assignment.created_at,
        ).model_dump(),
    }


@router.put("/{assignment_id}")
def update_assignment(
    assignment_id: int = Path(...),
    data: AssignmentUpdate = Body(...),
    current_user: User = Depends(get_current_teacher),
    db: Session = Depends(get_db),
):
    """Update an assignment (teacher only)."""
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise NotFoundException(detail="Assignment not found")

    update_dict = data.model_dump(exclude_unset=True)
    for field, value in update_dict.items():
        setattr(assignment, field, value)
    assignment.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(assignment)

    return {
        "status": "success",
        "message": "Assignment updated successfully",
        "data": AssignmentResponse(
            id=assignment.id, uid=assignment.uid, subject_id=assignment.subject_id,
            teacher_id=assignment.teacher_id, title=assignment.title,
            description=assignment.description, due_date=assignment.due_date,
            total_marks=assignment.total_marks, is_active=assignment.is_active,
            created_at=assignment.created_at,
        ).model_dump(),
    }


@router.post("/{assignment_id}/submit")
def submit_assignment(
    assignment_id: int = Path(...),
    data: SubmissionCreate = Body(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Submit an assignment."""
    assignment = db.query(Assignment).filter(
        Assignment.id == assignment_id, Assignment.is_active == True
    ).first()
    if not assignment:
        raise NotFoundException(detail="Assignment not found")

    existing = db.query(Submission).filter(
        Submission.assignment_id == assignment_id,
        Submission.user_id == current_user.id,
    ).first()
    if existing:
        from app.core.exceptions import ConflictException
        raise ConflictException(detail="Already submitted this assignment")

    submission = Submission(
        uid=generate_id("SUBM"),
        assignment_id=assignment_id,
        user_id=current_user.id,
        file_url=data.file_url,
        content=data.content,
        submitted_at=datetime.utcnow(),
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)

    return {
        "status": "success",
        "message": "Assignment submitted successfully",
        "data": SubmissionResponse(
            id=submission.id, uid=submission.uid, assignment_id=submission.assignment_id,
            user_id=submission.user_id, file_url=submission.file_url, content=submission.content,
            marks_obtained=submission.marks_obtained, feedback=submission.feedback,
            is_graded=submission.is_graded, submitted_at=submission.submitted_at,
        ).model_dump(),
    }


@router.put("/{submission_id}/grade")
def grade_submission(
    submission_id: int = Path(...),
    data: GradeSubmission = Body(...),
    current_user: User = Depends(get_current_teacher),
    db: Session = Depends(get_db),
):
    """Grade a submission (teacher only)."""
    submission = db.query(Submission).filter(Submission.id == submission_id).first()
    if not submission:
        raise NotFoundException(detail="Submission not found")

    submission.marks_obtained = data.marks_obtained
    submission.feedback = data.feedback
    submission.is_graded = True
    submission.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(submission)

    return {
        "status": "success",
        "message": "Submission graded successfully",
        "data": SubmissionResponse(
            id=submission.id, uid=submission.uid, assignment_id=submission.assignment_id,
            user_id=submission.user_id, file_url=submission.file_url, content=submission.content,
            marks_obtained=submission.marks_obtained, feedback=submission.feedback,
            is_graded=submission.is_graded, submitted_at=submission.submitted_at,
        ).model_dump(),
    }


@router.get("/{assignment_id}/submissions")
def get_submissions(
    assignment_id: int = Path(...),
    current_user: User = Depends(get_current_teacher),
    db: Session = Depends(get_db),
):
    """Get all submissions for an assignment (teacher only)."""
    assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not assignment:
        raise NotFoundException(detail="Assignment not found")

    submissions = db.query(Submission).filter(
        Submission.assignment_id == assignment_id,
    ).order_by(Submission.submitted_at.desc()).all()

    result = []
    for s in submissions:
        user = db.query(User).filter(User.id == s.user_id).first()
        result.append({
            **SubmissionResponse(
                id=s.id, uid=s.uid, assignment_id=s.assignment_id, user_id=s.user_id,
                file_url=s.file_url, content=s.content, marks_obtained=s.marks_obtained,
                feedback=s.feedback, is_graded=s.is_graded, submitted_at=s.submitted_at,
            ).model_dump(),
            "student_name": user.full_name if user else None,
            "student_uid": user.uid if user else None,
        })

    return {
        "status": "success",
        "message": "Submissions retrieved successfully",
        "data": result,
    }
