from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models import User, Leaderboard

router = APIRouter(prefix="/api/v1/leaderboard", tags=["Leaderboard"])


@router.get("/")
def get_leaderboard(
    category: str = Query("weekly", description="weekly/monthly/all_time"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get leaderboard filtered by category. Limit to top 100."""
    entries = db.query(Leaderboard).filter(
        Leaderboard.category == category,
    ).order_by(Leaderboard.score.desc()).limit(100).all()

    result = []
    for i, entry in enumerate(entries, 1):
        user = db.query(User).filter(User.id == entry.user_id).first()
        result.append({
            "rank": i,
            "user_id": entry.user_id,
            "full_name": user.full_name if user else "Unknown",
            "avatar_url": user.avatar_url if user else None,
            "score": entry.score,
            "level": user.level if user else 1,
        })

    return {
        "status": "success",
        "message": "Leaderboard retrieved successfully",
        "data": result,
    }


@router.get("/rank")
def get_my_rank(
    category: str = Query("weekly", description="weekly/monthly/all_time"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get current user's rank."""
    entry = db.query(Leaderboard).filter(
        Leaderboard.user_id == current_user.id,
        Leaderboard.category == category,
    ).first()

    if not entry:
        return {
            "status": "success",
            "message": "Rank retrieved",
            "data": {
                "rank": 0,
                "score": 0,
                "category": category,
            },
        }

    rank = db.query(Leaderboard).filter(
        Leaderboard.category == category,
        Leaderboard.score > entry.score,
    ).count() + 1

    return {
        "status": "success",
        "message": "Rank retrieved",
        "data": {
            "rank": rank,
            "score": entry.score,
            "category": category,
        },
    }


@router.get("/class")
def get_class_leaderboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get class leaderboard."""
    class_users = db.query(User).filter(
        User.class_name == current_user.class_name,
        User.is_active == True,
    ).all()

    user_ids = [u.id for u in class_users]
    entries = db.query(Leaderboard).filter(
        Leaderboard.user_id.in_(user_ids),
        Leaderboard.category == "all_time",
    ).order_by(Leaderboard.score.desc()).limit(50).all()

    result = []
    for i, entry in enumerate(entries, 1):
        user = db.query(User).filter(User.id == entry.user_id).first()
        result.append({
            "rank": i,
            "user_id": entry.user_id,
            "full_name": user.full_name if user else "Unknown",
            "avatar_url": user.avatar_url if user else None,
            "score": entry.score,
            "level": user.level if user else 1,
        })

    return {
        "status": "success",
        "message": "Class leaderboard retrieved",
        "data": result,
    }


@router.get("/school")
def get_school_leaderboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get school leaderboard."""
    entries = db.query(Leaderboard).filter(
        Leaderboard.category == "all_time",
    ).order_by(Leaderboard.score.desc()).limit(50).all()

    result = []
    for i, entry in enumerate(entries, 1):
        user = db.query(User).filter(User.id == entry.user_id).first()
        result.append({
            "rank": i,
            "user_id": entry.user_id,
            "full_name": user.full_name if user else "Unknown",
            "avatar_url": user.avatar_url if user else None,
            "score": entry.score,
            "level": user.level if user else 1,
            "school": user.school if user else None,
        })

    return {
        "status": "success",
        "message": "School leaderboard retrieved",
        "data": result,
    }
