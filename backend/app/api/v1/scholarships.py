from fastapi import APIRouter, Depends, Query, Path
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.dependencies import get_current_user
from app.core.exceptions import NotFoundException
from app.models import User, Scholarship
from app.schemas import ScholarshipResponse

router = APIRouter(prefix="/api/v1/scholarships", tags=["Scholarships"])


@router.get("/")
def list_scholarships(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all active scholarships."""
    query = db.query(Scholarship).filter(Scholarship.is_active == True)

    if search:
        query = query.filter(
            (Scholarship.title.ilike(f"%{search}%")) |
            (Scholarship.description.ilike(f"%{search}%")) |
            (Scholarship.organization.ilike(f"%{search}%"))
        )

    total = query.count()
    scholarships = query.order_by(Scholarship.deadline.asc()).offset((page - 1) * per_page).limit(per_page).all()

    return {
        "status": "success",
        "message": "Scholarships retrieved successfully",
        "data": [
            {
                "id": s.id,
                "uid": s.uid,
                "title": s.title,
                "description": s.description,
                "organization": s.organization,
                "amount": s.amount,
                "eligibility": s.eligibility,
                "deadline": s.deadline.isoformat() if s.deadline else None,
                "application_url": s.application_url,
                "created_at": s.created_at.isoformat() if s.created_at else None,
            }
            for s in scholarships
        ],
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": (total + per_page - 1) // per_page,
    }


@router.get("/{scholarship_id}")
def get_scholarship(
    scholarship_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get scholarship detail."""
    scholarship = db.query(Scholarship).filter(
        Scholarship.id == scholarship_id,
        Scholarship.is_active == True,
    ).first()
    if not scholarship:
        raise NotFoundException(detail="Scholarship not found")

    return {
        "status": "success",
        "message": "Scholarship retrieved successfully",
        "data": {
            "id": scholarship.id,
            "uid": scholarship.uid,
            "title": scholarship.title,
            "description": scholarship.description,
            "organization": scholarship.organization,
            "amount": scholarship.amount,
            "eligibility": scholarship.eligibility,
            "deadline": scholarship.deadline.isoformat() if scholarship.deadline else None,
            "application_url": scholarship.application_url,
            "created_at": scholarship.created_at.isoformat() if scholarship.created_at else None,
        },
    }
