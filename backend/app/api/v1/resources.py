from fastapi import APIRouter, Depends, Query, Path, Body
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime

from app.database import get_db
from app.dependencies import get_current_user, get_current_teacher
from app.core.exceptions import NotFoundException, BadRequestException, ConflictException
from app.models import User, Resource, Subject, ResourceDownload, Video
from app.schemas import ResourceCreate, ResourceResponse
from app.utils.id_generator import generate_id

router = APIRouter(prefix="/api/v1/resources", tags=["Resources"])


def _resource_to_response(resource: Resource) -> dict:
    return ResourceResponse(
        id=resource.id,
        uid=resource.uid,
        subject_id=resource.subject_id,
        lesson_id=resource.lesson_id,
        title=resource.title,
        description=resource.description,
        type=resource.type.value if hasattr(resource.type, 'value') else resource.type,
        file_url=resource.file_url,
        file_size=resource.file_size,
        thumbnail_url=resource.thumbnail_url,
        is_featured=resource.is_featured,
        download_count=resource.download_count,
        created_at=resource.created_at,
    ).model_dump()


@router.get("/")
def list_resources(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    subject_id: Optional[int] = Query(None),
    lesson_id: Optional[int] = Query(None),
    resource_type: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List resources with filters for subject_id, lesson_id, type, and search."""
    query = db.query(Resource).filter(Resource.is_active == True)

    if subject_id:
        query = query.filter(Resource.subject_id == subject_id)
    if lesson_id:
        query = query.filter(Resource.lesson_id == lesson_id)
    if resource_type:
        query = query.filter(Resource.type == resource_type)
    if search:
        query = query.filter(
            (Resource.title.ilike(f"%{search}%")) |
            (Resource.description.ilike(f"%{search}%"))
        )

    total = query.count()
    resources = query.order_by(Resource.created_at.desc()).offset((page - 1) * per_page).limit(per_page).all()

    return {
        "status": "success",
        "message": "Resources retrieved successfully",
        "data": [_resource_to_response(r) for r in resources],
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": (total + per_page - 1) // per_page,
    }


@router.get("/bookmarked")
def get_bookmarked_resources(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get bookmarked resources for the current user."""
    from app.models.gamification import Reward
    bookmark_ids = db.query(Reward.reference_id).filter(
        Reward.user_id == current_user.id,
        Reward.type == "bookmark_resource",
    ).all()
    ids = [b[0] for b in bookmark_ids if b[0]]

    resources = db.query(Resource).filter(Resource.id.in_(ids), Resource.is_active == True).all()
    total = len(resources)
    paginated = resources[(page - 1) * per_page:page * per_page]

    return {
        "status": "success",
        "message": "Bookmarked resources retrieved successfully",
        "data": [_resource_to_response(r) for r in paginated],
        "total": total,
        "page": page,
        "per_page": per_page,
    }


@router.get("/recommended")
def get_recommended_resources(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get recommended resources based on user's class/subjects."""
    resources = db.query(Resource).filter(
        Resource.is_active == True,
        Resource.is_featured == True,
    ).order_by(Resource.download_count.desc()).limit(10).all()

    return {
        "status": "success",
        "message": "Recommended resources retrieved successfully",
        "data": [_resource_to_response(r) for r in resources],
    }


@router.get("/recent")
def get_recent_resources(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get recently viewed/downloaded resources for the user."""
    downloads = db.query(ResourceDownload).filter(
        ResourceDownload.user_id == current_user.id,
    ).order_by(ResourceDownload.downloaded_at.desc()).limit(10).all()

    resource_ids = [d.resource_id for d in downloads]
    resources = db.query(Resource).filter(Resource.id.in_(resource_ids)).all() if resource_ids else []

    return {
        "status": "success",
        "message": "Recent resources retrieved successfully",
        "data": [_resource_to_response(r) for r in resources],
    }


@router.get("/{resource_id}")
def get_resource(
    resource_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get resource detail."""
    resource = db.query(Resource).filter(Resource.id == resource_id, Resource.is_active == True).first()
    if not resource:
        raise NotFoundException(detail="Resource not found")

    return {
        "status": "success",
        "message": "Resource retrieved successfully",
        "data": _resource_to_response(resource),
    }


@router.post("/")
def create_resource(
    resource_data: ResourceCreate,
    current_user: User = Depends(get_current_teacher),
    db: Session = Depends(get_db),
):
    """Create a new resource (teacher/admin only)."""
    subject = db.query(Subject).filter(Subject.id == resource_data.subject_id).first()
    if not subject:
        raise NotFoundException(detail="Subject not found")

    new_resource = Resource(
        uid=generate_id("RES"),
        subject_id=resource_data.subject_id,
        lesson_id=resource_data.lesson_id,
        title=resource_data.title,
        description=resource_data.description,
        type=resource_data.type,
        file_url=resource_data.file_url,
        file_size=resource_data.file_size,
        mime_type=resource_data.mime_type,
        thumbnail_url=resource_data.thumbnail_url,
        is_active=True,
    )
    db.add(new_resource)
    db.commit()
    db.refresh(new_resource)

    return {
        "status": "success",
        "message": "Resource created successfully",
        "data": _resource_to_response(new_resource),
    }


@router.delete("/{resource_id}")
def delete_resource(
    resource_id: int = Path(...),
    current_user: User = Depends(get_current_teacher),
    db: Session = Depends(get_db),
):
    """Soft-delete a resource (teacher/admin only)."""
    resource = db.query(Resource).filter(Resource.id == resource_id).first()
    if not resource:
        raise NotFoundException(detail="Resource not found")

    resource.is_active = False
    resource.updated_at = datetime.utcnow()
    db.commit()

    return {
        "status": "success",
        "message": "Resource deleted successfully",
        "data": None,
    }


@router.post("/{resource_id}/bookmark")
def bookmark_resource(
    resource_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Bookmark a resource."""
    resource = db.query(Resource).filter(Resource.id == resource_id, Resource.is_active == True).first()
    if not resource:
        raise NotFoundException(detail="Resource not found")

    from app.models.gamification import Reward
    existing = db.query(Reward).filter(
        Reward.user_id == current_user.id,
        Reward.type == "bookmark_resource",
        Reward.reference_id == resource_id,
    ).first()
    if existing:
        raise ConflictException(detail="Resource already bookmarked")

    reward = Reward(
        uid=generate_id("RWRD"),
        user_id=current_user.id,
        type="bookmark_resource",
        amount=0,
        description=f"Bookmarked resource: {resource.title}",
        reference_type="resource",
        reference_id=resource_id,
    )
    db.add(reward)
    db.commit()

    return {
        "status": "success",
        "message": "Resource bookmarked successfully",
        "data": None,
    }


@router.delete("/{resource_id}/bookmark")
def remove_bookmark(
    resource_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Remove bookmark from a resource."""
    from app.models.gamification import Reward
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
        "message": "Bookmark removed successfully",
        "data": None,
    }


@router.post("/{resource_id}/download")
def track_download(
    resource_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Track download and increment download_count."""
    resource = db.query(Resource).filter(Resource.id == resource_id, Resource.is_active == True).first()
    if not resource:
        raise NotFoundException(detail="Resource not found")

    resource.download_count += 1

    download = ResourceDownload(
        uid=generate_id("DL"),
        user_id=current_user.id,
        resource_id=resource_id,
    )
    db.add(download)
    db.commit()

    return {
        "status": "success",
        "message": "Download tracked successfully",
        "data": {"download_count": resource.download_count},
    }
