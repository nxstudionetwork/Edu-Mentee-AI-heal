from fastapi import APIRouter, Depends, Query, Path, Body
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.dependencies import get_current_user, get_current_admin
from app.core.exceptions import NotFoundException, BadRequestException, ForbiddenException
from app.models import User, UserRole, Leaderboard
from app.schemas import UserUpdate, UserResponse, MessageResponse

router = APIRouter(prefix="/api/v1/users", tags=["Users"])


def _user_to_response(user: User) -> dict:
    return UserResponse(
        id=user.id,
        uid=user.uid,
        full_name=user.full_name,
        email=user.email,
        phone=user.phone,
        avatar_url=user.avatar_url,
        role=user.role.value if hasattr(user.role, 'value') else user.role,
        class_name=user.class_name,
        stream=user.stream,
        school=user.school,
        board=user.board,
        district=user.district,
        village_town=user.village_town,
        coins=user.coins,
        xp=user.xp,
        level=user.level,
        is_active=user.is_active,
        created_at=user.created_at,
    ).model_dump() | {
        "date_of_birth": user.date_of_birth.isoformat() if user.date_of_birth else None,
        "gender": user.gender.value if hasattr(user.gender, 'value') else user.gender,
        "state": user.state,
        "city": user.city,
        "pincode": user.pincode,
        "parent_name": user.parent_name,
        "parent_phone": user.parent_phone,
    }


@router.get("/")
def list_users(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    role: Optional[str] = Query(None),
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """List all users (admin only). Supports search and role filter."""
    query = db.query(User)

    if search:
        query = query.filter(
            (User.full_name.ilike(f"%{search}%")) |
            (User.email.ilike(f"%{search}%")) |
            (User.login_id.ilike(f"%{search}%"))
        )
    if role:
        query = query.filter(User.role == role)

    total = query.count()
    users = query.offset((page - 1) * per_page).limit(per_page).all()

    return {
        "status": "success",
        "message": "Users retrieved successfully",
        "data": [_user_to_response(u) for u in users],
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": (total + per_page - 1) // per_page,
    }


@router.get("/{user_id}")
def get_user(
    user_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get user by ID."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise NotFoundException(detail="User not found")

    return {
        "status": "success",
        "message": "User retrieved successfully",
        "data": _user_to_response(user),
    }


@router.get("/profile/{user_id}")
def get_user_profile(
    user_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get user profile with stats (coins, xp, level, rank)."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise NotFoundException(detail="User not found")

    leaderboard_entry = db.query(Leaderboard).filter(
        Leaderboard.user_id == user.id,
        Leaderboard.category == "all_time",
    ).first()
    rank = leaderboard_entry.rank if leaderboard_entry else 0

    return {
        "status": "success",
        "message": "User profile retrieved successfully",
        "data": {
            **_user_to_response(user),
            "rank": rank,
            "stats": {
                "coins": user.coins,
                "xp": user.xp,
                "level": user.level,
                "rank": rank,
            },
        },
    }


@router.put("/{user_id}")
def update_user(
    user_id: int = Path(...),
    user_data: UserUpdate = Body(...),
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Update user details (admin only)."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise NotFoundException(detail="User not found")

    update_dict = user_data.model_dump(exclude_unset=True)
    for field, value in update_dict.items():
        setattr(user, field, value)

    db.commit()
    db.refresh(user)

    return {
        "status": "success",
        "message": "User updated successfully",
        "data": _user_to_response(user),
    }


@router.patch("/{user_id}/status")
def toggle_user_status(
    user_id: int = Path(...),
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Toggle user active status (admin only)."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise NotFoundException(detail="User not found")

    user.is_active = not user.is_active
    db.commit()
    db.refresh(user)

    return {
        "status": "success",
        "message": f"User {'activated' if user.is_active else 'deactivated'} successfully",
        "data": _user_to_response(user),
    }
