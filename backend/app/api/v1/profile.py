from fastapi import APIRouter, Depends, Path, Body
from sqlalchemy.orm import Session
from datetime import datetime

from app.database import get_db
from app.dependencies import get_current_user
from app.core.exceptions import NotFoundException
from app.models import User, Achievement, UserBadge, Leaderboard
from app.schemas import ProfileUpdate, AvatarUpdate

router = APIRouter(prefix="/api/v1/profile", tags=["Profile"])


@router.get("/")
def get_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get full user profile with personal info, stats, achievements, certificates."""
    user_badges = db.query(UserBadge).filter(UserBadge.user_id == current_user.id).all()
    achievement_ids = [ub.achievement_id for ub in user_badges if ub.achievement_id]
    achievements = db.query(Achievement).filter(Achievement.id.in_(achievement_ids)).all() if achievement_ids else []

    leaderboard = db.query(Leaderboard).filter(
        Leaderboard.user_id == current_user.id,
        Leaderboard.category == "all_time",
    ).first()

    return {
        "status": "success",
        "message": "Profile retrieved successfully",
        "data": {
            "id": current_user.id,
            "uid": current_user.uid,
            "full_name": current_user.full_name,
            "email": current_user.email,
            "phone": current_user.phone,
            "avatar_url": current_user.avatar_url,
            "role": current_user.role.value if hasattr(current_user.role, 'value') else current_user.role,
            "class_name": current_user.class_name,
            "section": current_user.section,
            "stream": current_user.stream,
            "school": current_user.school,
            "board": current_user.board,
            "date_of_birth": current_user.date_of_birth.isoformat() if current_user.date_of_birth else None,
            "gender": current_user.gender.value if current_user.gender and hasattr(current_user.gender, 'value') else current_user.gender,
            "address": current_user.address,
            "city": current_user.city,
            "state": current_user.state,
            "district": current_user.district,
            "village_town": current_user.village_town,
            "pincode": current_user.pincode,
            "parent_name": current_user.parent_name,
            "parent_phone": current_user.parent_phone,
            "parent_email": current_user.parent_email,
            "emergency_contact_name": current_user.emergency_contact_name,
            "emergency_contact_phone": current_user.emergency_contact_phone,
            "coins": current_user.coins,
            "xp": current_user.xp,
            "level": current_user.level,
            "rank": leaderboard.rank if leaderboard else 0,
            "is_verified": current_user.is_verified,
            "language_preference": current_user.language_preference,
            "created_at": current_user.created_at.isoformat() if current_user.created_at else None,
            "achievements": [
                {
                    "id": a.id,
                    "uid": a.uid,
                    "name": a.name,
                    "description": a.description,
                    "icon": a.icon,
                }
                for a in achievements
            ],
            "certificates": [],
        },
    }


@router.put("/")
def update_profile(
    data: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update user profile."""
    update_dict = data.model_dump(exclude_unset=True)
    for field, value in update_dict.items():
        setattr(current_user, field, value)
    current_user.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(current_user)

    return {
        "status": "success",
        "message": "Profile updated successfully",
        "data": {
            "id": current_user.id,
            "uid": current_user.uid,
            "full_name": current_user.full_name,
            "email": current_user.email,
            "phone": current_user.phone,
        },
    }


@router.put("/avatar")
def update_avatar(
    data: AvatarUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update avatar (accept base64 or URL)."""
    if data.avatar_url:
        current_user.avatar_url = data.avatar_url
    elif data.avatar_base64:
        current_user.avatar_url = f"data:image/png;base64,{data.avatar_base64[:50]}..."
    else:
        from app.core.exceptions import BadRequestException
        raise BadRequestException(detail="avatar_url or avatar_base64 is required")

    current_user.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(current_user)

    return {
        "status": "success",
        "message": "Avatar updated successfully",
        "data": {"avatar_url": current_user.avatar_url},
    }


@router.get("/stats")
def get_profile_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get learning statistics for profile."""
    from app.models.quiz import QuizAttempt

    total_quizzes = db.query(QuizAttempt).filter(
        QuizAttempt.user_id == current_user.id,
        QuizAttempt.completed_at.isnot(None),
    ).count()

    passed = db.query(QuizAttempt).filter(
        QuizAttempt.user_id == current_user.id,
        QuizAttempt.is_passed == True,
    ).count()

    from sqlalchemy import func
    avg_score = db.query(func.avg(QuizAttempt.score)).filter(
        QuizAttempt.user_id == current_user.id,
        QuizAttempt.completed_at.isnot(None),
    ).scalar() or 0.0

    return {
        "status": "success",
        "message": "Profile stats retrieved",
        "data": {
            "total_quizzes": total_quizzes,
            "quizzes_passed": passed,
            "average_score": round(float(avg_score), 2),
            "total_xp": current_user.xp,
            "level": current_user.level,
            "coins": current_user.coins,
            "study_hours": 0,
        },
    }
