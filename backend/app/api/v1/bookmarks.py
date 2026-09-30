from fastapi import APIRouter, Depends, Query, Path, Body
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime

from app.database import get_db
from app.dependencies import get_current_user
from app.core.exceptions import NotFoundException, BadRequestException, ConflictException
from app.models import User, Resource, Video, Reward
from app.schemas import BookmarkCreate
from app.utils.id_generator import generate_id

router = APIRouter(prefix="/api/v1/bookmarks", tags=["Bookmarks"])


@router.get("/")
def list_bookmarks(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    bookmark_type: Optional[str] = Query(None, description="resource/video/all"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List user's bookmarks (resources, videos)."""
    query = db.query(Reward).filter(
        Reward.user_id == current_user.id,
        Reward.type.in_(["bookmark_resource", "bookmark_video"]),
    )

    if bookmark_type == "resource":
        query = query.filter(Reward.type == "bookmark_resource")
    elif bookmark_type == "video":
        query = query.filter(Reward.type == "bookmark_video")

    total = query.count()
    bookmarks = query.order_by(Reward.created_at.desc()).offset((page - 1) * per_page).limit(per_page).all()

    result = []
    for b in bookmarks:
        item = None
        if b.type == "bookmark_resource" and b.reference_id:
            resource = db.query(Resource).filter(Resource.id == b.reference_id).first()
            if resource:
                item = {"type": "resource", "id": resource.id, "uid": resource.uid, "title": resource.title}
        elif b.type == "bookmark_video" and b.reference_id:
            video = db.query(Video).filter(Video.id == b.reference_id).first()
            if video:
                item = {"type": "video", "id": video.id, "uid": video.uid, "title": video.title}

        result.append({
            "id": b.id,
            "uid": b.uid,
            "bookmark_type": b.type.replace("bookmark_", ""),
            "reference_id": b.reference_id,
            "item": item,
            "created_at": b.created_at.isoformat() if b.created_at else None,
        })

    return {
        "status": "success",
        "message": "Bookmarks retrieved successfully",
        "data": result,
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": (total + per_page - 1) // per_page,
    }


@router.post("/")
def add_bookmark(
    data: BookmarkCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Add a bookmark (resource_id or video_id required)."""
    if not data.resource_id and not data.video_id:
        raise BadRequestException(detail="Either resource_id or video_id is required")

    if data.resource_id:
        resource = db.query(Resource).filter(Resource.id == data.resource_id).first()
        if not resource:
            raise NotFoundException(detail="Resource not found")

        existing = db.query(Reward).filter(
            Reward.user_id == current_user.id,
            Reward.type == "bookmark_resource",
            Reward.reference_id == data.resource_id,
        ).first()
        if existing:
            raise ConflictException(detail="Resource already bookmarked")

        bookmark = Reward(
            uid=generate_id("RWRD"),
            user_id=current_user.id,
            type="bookmark_resource",
            amount=0,
            description=f"Bookmarked: {resource.title}",
            reference_type="resource",
            reference_id=data.resource_id,
        )
        db.add(bookmark)
        db.commit()
        db.refresh(bookmark)

        return {
            "status": "success",
            "message": "Resource bookmarked successfully",
            "data": {"id": bookmark.id, "uid": bookmark.uid, "type": "resource", "reference_id": data.resource_id},
        }

    elif data.video_id:
        video = db.query(Video).filter(Video.id == data.video_id).first()
        if not video:
            raise NotFoundException(detail="Video not found")

        existing = db.query(Reward).filter(
            Reward.user_id == current_user.id,
            Reward.type == "bookmark_video",
            Reward.reference_id == data.video_id,
        ).first()
        if existing:
            raise ConflictException(detail="Video already bookmarked")

        bookmark = Reward(
            uid=generate_id("RWRD"),
            user_id=current_user.id,
            type="bookmark_video",
            amount=0,
            description=f"Bookmarked: {video.title}",
            reference_type="video",
            reference_id=data.video_id,
        )
        db.add(bookmark)
        db.commit()
        db.refresh(bookmark)

        return {
            "status": "success",
            "message": "Video bookmarked successfully",
            "data": {"id": bookmark.id, "uid": bookmark.uid, "type": "video", "reference_id": data.video_id},
        }


@router.delete("/{bookmark_id}")
def remove_bookmark_by_id(
    bookmark_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Remove bookmark by ID."""
    bookmark = db.query(Reward).filter(
        Reward.id == bookmark_id,
        Reward.user_id == current_user.id,
        Reward.type.in_(["bookmark_resource", "bookmark_video"]),
    ).first()
    if not bookmark:
        raise NotFoundException(detail="Bookmark not found")

    db.delete(bookmark)
    db.commit()

    return {
        "status": "success",
        "message": "Bookmark removed successfully",
        "data": None,
    }


@router.delete("/resource/{resource_id}")
def remove_bookmark_by_resource(
    resource_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Remove bookmark by resource ID."""
    bookmark = db.query(Reward).filter(
        Reward.user_id == current_user.id,
        Reward.type == "bookmark_resource",
        Reward.reference_id == resource_id,
    ).first()
    if not bookmark:
        raise NotFoundException(detail="Bookmark not found")

    db.delete(bookmark)
    db.commit()

    return {
        "status": "success",
        "message": "Resource bookmark removed",
        "data": None,
    }


@router.delete("/video/{video_id}")
def remove_bookmark_by_video(
    video_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Remove bookmark by video ID."""
    bookmark = db.query(Reward).filter(
        Reward.user_id == current_user.id,
        Reward.type == "bookmark_video",
        Reward.reference_id == video_id,
    ).first()
    if not bookmark:
        raise NotFoundException(detail="Bookmark not found")

    db.delete(bookmark)
    db.commit()

    return {
        "status": "success",
        "message": "Video bookmark removed",
        "data": None,
    }
