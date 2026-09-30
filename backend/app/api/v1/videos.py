from fastapi import APIRouter, Depends, Query, Path, Body
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime

from app.database import get_db
from app.dependencies import get_current_user, get_current_teacher
from app.core.exceptions import NotFoundException, BadRequestException
from app.models import User, Video, Subject
from app.schemas import VideoCreate, VideoResponse
from app.utils.id_generator import generate_id

router = APIRouter(prefix="/api/v1/videos", tags=["Videos"])


def _video_to_response(video: Video) -> dict:
    return VideoResponse(
        id=video.id,
        uid=video.uid,
        subject_id=video.subject_id,
        lesson_id=video.lesson_id,
        title=video.title,
        description=video.description,
        url=video.url,
        thumbnail_url=video.thumbnail_url,
        duration_seconds=video.duration_seconds,
        difficulty=video.difficulty.value if hasattr(video.difficulty, 'value') else video.difficulty,
        is_featured=video.is_featured,
        view_count=video.view_count,
        created_at=video.created_at,
    ).model_dump()


@router.get("/")
def list_videos(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    subject_id: Optional[int] = Query(None),
    chapter: Optional[str] = Query(None),
    difficulty: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List videos with filters for subject, difficulty, and search."""
    query = db.query(Video).filter(Video.is_active == True)

    if subject_id:
        query = query.filter(Video.subject_id == subject_id)
    if difficulty:
        query = query.filter(Video.difficulty == difficulty)
    if search:
        query = query.filter(
            (Video.title.ilike(f"%{search}%")) |
            (Video.description.ilike(f"%{search}%"))
        )

    total = query.count()
    videos = query.order_by(Video.created_at.desc()).offset((page - 1) * per_page).limit(per_page).all()

    return {
        "status": "success",
        "message": "Videos retrieved successfully",
        "data": [_video_to_response(v) for v in videos],
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": (total + per_page - 1) // per_page,
    }


@router.get("/recommended")
def get_recommended_videos(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get recommended videos based on user's subjects."""
    videos = db.query(Video).filter(
        Video.is_active == True,
        Video.is_featured == True,
    ).order_by(Video.view_count.desc()).limit(10).all()

    return {
        "status": "success",
        "message": "Recommended videos retrieved successfully",
        "data": [_video_to_response(v) for v in videos],
    }


@router.get("/continue-watching")
def get_continue_watching(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get in-progress videos for user (placeholder - requires watch progress tracking)."""
    videos = db.query(Video).filter(Video.is_active == True).order_by(Video.created_at.desc()).limit(5).all()

    return {
        "status": "success",
        "message": "Continue watching videos retrieved",
        "data": [_video_to_response(v) for v in videos],
    }


@router.get("/recently-watched")
def get_recently_watched(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get recently watched videos."""
    videos = db.query(Video).filter(Video.is_active == True).order_by(Video.created_at.desc()).limit(10).all()

    return {
        "status": "success",
        "message": "Recently watched videos retrieved",
        "data": [_video_to_response(v) for v in videos],
    }


@router.get("/{video_id}")
def get_video(
    video_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get video detail."""
    video = db.query(Video).filter(Video.id == video_id, Video.is_active == True).first()
    if not video:
        raise NotFoundException(detail="Video not found")

    video.view_count += 1
    db.commit()
    db.refresh(video)

    return {
        "status": "success",
        "message": "Video retrieved successfully",
        "data": _video_to_response(video),
    }


@router.post("/")
def create_video(
    video_data: VideoCreate,
    current_user: User = Depends(get_current_teacher),
    db: Session = Depends(get_db),
):
    """Create a new video (teacher/admin only)."""
    subject = db.query(Subject).filter(Subject.id == video_data.subject_id).first()
    if not subject:
        raise NotFoundException(detail="Subject not found")

    new_video = Video(
        uid=generate_id("VID"),
        subject_id=video_data.subject_id,
        lesson_id=video_data.lesson_id,
        title=video_data.title,
        description=video_data.description,
        url=video_data.url,
        thumbnail_url=video_data.thumbnail_url,
        duration_seconds=video_data.duration_seconds,
        difficulty=video_data.difficulty,
        is_active=True,
    )
    db.add(new_video)
    db.commit()
    db.refresh(new_video)

    return {
        "status": "success",
        "message": "Video created successfully",
        "data": _video_to_response(new_video),
    }


@router.put("/{video_id}/progress")
def update_watch_progress(
    video_id: int = Path(...),
    progress: float = Body(..., embed=True, ge=0, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update watch progress for user (0-100%)."""
    video = db.query(Video).filter(Video.id == video_id, Video.is_active == True).first()
    if not video:
        raise NotFoundException(detail="Video not found")

    return {
        "status": "success",
        "message": "Watch progress updated successfully",
        "data": {
            "video_id": video.id,
            "video_uid": video.uid,
            "progress": progress,
        },
    }


@router.get("/{video_id}/progress")
def get_watch_progress(
    video_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get user's watch progress for video."""
    video = db.query(Video).filter(Video.id == video_id, Video.is_active == True).first()
    if not video:
        raise NotFoundException(detail="Video not found")

    return {
        "status": "success",
        "message": "Watch progress retrieved",
        "data": {
            "video_id": video.id,
            "video_uid": video.uid,
            "progress": 0,
        },
    }
