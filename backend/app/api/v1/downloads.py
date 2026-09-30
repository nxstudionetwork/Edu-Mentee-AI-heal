from fastapi import APIRouter, Depends, Query, Path
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.dependencies import get_current_user
from app.core.exceptions import NotFoundException
from app.models import User, ResourceDownload, Resource
from app.schemas import DownloadResponse

router = APIRouter(prefix="/api/v1/downloads", tags=["Downloads"])


@router.get("/")
def list_downloads(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get user's download history."""
    query = db.query(ResourceDownload).filter(
        ResourceDownload.user_id == current_user.id,
    ).order_by(ResourceDownload.downloaded_at.desc())

    total = query.count()
    downloads = query.offset((page - 1) * per_page).limit(per_page).all()

    result = []
    for d in downloads:
        resource = db.query(Resource).filter(Resource.id == d.resource_id).first()
        result.append({
            "id": d.id,
            "uid": d.uid,
            "resource_id": d.resource_id,
            "downloaded_at": d.downloaded_at.isoformat() if d.downloaded_at else None,
            "resource": {
                "id": resource.id,
                "uid": resource.uid,
                "title": resource.title,
                "type": resource.type.value if hasattr(resource.type, 'value') else resource.type,
                "file_url": resource.file_url,
            } if resource else None,
        })

    return {
        "status": "success",
        "message": "Downloads retrieved successfully",
        "data": result,
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": (total + per_page - 1) // per_page,
    }


@router.get("/{download_id}")
def get_download(
    download_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get download detail."""
    download = db.query(ResourceDownload).filter(
        ResourceDownload.id == download_id,
        ResourceDownload.user_id == current_user.id,
    ).first()
    if not download:
        raise NotFoundException(detail="Download record not found")

    resource = db.query(Resource).filter(Resource.id == download.resource_id).first()

    return {
        "status": "success",
        "message": "Download detail retrieved",
        "data": {
            "id": download.id,
            "uid": download.uid,
            "resource_id": download.resource_id,
            "downloaded_at": download.downloaded_at.isoformat() if download.downloaded_at else None,
            "resource": {
                "id": resource.id,
                "uid": resource.uid,
                "title": resource.title,
                "file_url": resource.file_url,
            } if resource else None,
        },
    }


@router.delete("/{download_id}")
def delete_download(
    download_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Remove download record."""
    download = db.query(ResourceDownload).filter(
        ResourceDownload.id == download_id,
        ResourceDownload.user_id == current_user.id,
    ).first()
    if not download:
        raise NotFoundException(detail="Download record not found")

    db.delete(download)
    db.commit()

    return {
        "status": "success",
        "message": "Download record deleted successfully",
        "data": None,
    }
