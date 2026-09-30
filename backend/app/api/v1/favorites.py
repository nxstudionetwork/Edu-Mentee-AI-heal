from fastapi import APIRouter, Depends, Query, Path, Body
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime

from app.database import get_db
from app.dependencies import get_current_user
from app.core.exceptions import NotFoundException, BadRequestException, ConflictException
from app.models import User, Reward
from app.schemas import FavoriteCreate
from app.utils.id_generator import generate_id

router = APIRouter(prefix="/api/v1/favorites", tags=["Favorites"])


@router.get("/")
def list_favorites(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    item_type: Optional[str] = Query(None, description="product/teacher/resource"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List favorites (products, teachers, resources)."""
    query = db.query(Reward).filter(
        Reward.user_id == current_user.id,
        Reward.type.in_(["favorite_product", "favorite_teacher", "favorite_resource"]),
    )

    if item_type:
        query = query.filter(Reward.type == f"favorite_{item_type}")

    total = query.count()
    favorites = query.order_by(Reward.created_at.desc()).offset((page - 1) * per_page).limit(per_page).all()

    return {
        "status": "success",
        "message": "Favorites retrieved successfully",
        "data": [
            {
                "id": f.id,
                "uid": f.uid,
                "item_type": f.type.replace("favorite_", ""),
                "item_id": f.reference_id,
                "description": f.description,
                "created_at": f.created_at.isoformat() if f.created_at else None,
            }
            for f in favorites
        ],
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": (total + per_page - 1) // per_page,
    }


@router.post("/")
def add_favorite(
    data: FavoriteCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Add to favorites."""
    valid_types = ["product", "teacher", "resource"]
    if data.item_type not in valid_types:
        raise BadRequestException(detail=f"Invalid item_type. Must be one of: {valid_types}")

    fav_type = f"favorite_{data.item_type}"

    existing = db.query(Reward).filter(
        Reward.user_id == current_user.id,
        Reward.type == fav_type,
        Reward.reference_id == data.item_id,
    ).first()
    if existing:
        raise ConflictException(detail="Already in favorites")

    favorite = Reward(
        uid=generate_id("RWRD"),
        user_id=current_user.id,
        type=fav_type,
        amount=0,
        description=f"Added {data.item_type} to favorites",
        reference_type=data.item_type,
        reference_id=data.item_id,
    )
    db.add(favorite)
    db.commit()
    db.refresh(favorite)

    return {
        "status": "success",
        "message": f"{data.item_type.capitalize()} added to favorites",
        "data": {
            "id": favorite.id,
            "uid": favorite.uid,
            "item_type": data.item_type,
            "item_id": data.item_id,
        },
    }


@router.delete("/{favorite_id}")
def remove_favorite(
    favorite_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Remove from favorites."""
    favorite = db.query(Reward).filter(
        Reward.id == favorite_id,
        Reward.user_id == current_user.id,
        Reward.type.in_(["favorite_product", "favorite_teacher", "favorite_resource"]),
    ).first()
    if not favorite:
        raise NotFoundException(detail="Favorite not found")

    db.delete(favorite)
    db.commit()

    return {
        "status": "success",
        "message": "Removed from favorites",
        "data": None,
    }
