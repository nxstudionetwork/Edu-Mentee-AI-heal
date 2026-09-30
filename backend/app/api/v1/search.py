from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models import User, Resource, Video, Subject, Teacher, Product

router = APIRouter(prefix="/api/v1/search", tags=["Search"])


@router.get("/")
def global_search(
    q: str = Query(..., min_length=1, description="Search query"),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Global search across resources, videos, subjects, teachers, marketplace."""
    search_term = f"%{q}%"
    limit = per_page

    resources = db.query(Resource).filter(
        Resource.is_active == True,
        (Resource.title.ilike(search_term)) | (Resource.description.ilike(search_term)),
    ).limit(limit).all()

    videos = db.query(Video).filter(
        Video.is_active == True,
        (Video.title.ilike(search_term)) | (Video.description.ilike(search_term)),
    ).limit(limit).all()

    subjects = db.query(Subject).filter(
        Subject.is_active == True,
        (Subject.name.ilike(search_term)) | (Subject.description.ilike(search_term)),
    ).limit(limit).all()

    teachers = db.query(Teacher).all()
    teacher_results = []
    for t in teachers:
        user = db.query(User).filter(User.id == t.user_id).first()
        if user and (q.lower() in user.full_name.lower() or
                     (t.bio and q.lower() in t.bio.lower())):
            teacher_results.append({
                "id": t.id,
                "uid": t.uid,
                "name": user.full_name,
                "avatar_url": user.avatar_url,
                "qualification": t.qualification,
                "subjects": t.subjects,
                "is_available": t.is_available,
                "relevance": 0.8,
            })
    teacher_results = teacher_results[:limit]

    products = db.query(Product).filter(
        Product.is_active == True,
        (Product.name.ilike(search_term)) | (Product.description.ilike(search_term)),
    ).limit(limit).all()

    total = len(resources) + len(videos) + len(subjects) + len(teacher_results) + len(products)

    return {
        "status": "success",
        "message": "Search results retrieved",
        "data": {
            "query": q,
            "total": total,
            "resources": [
                {
                    "id": r.id,
                    "uid": r.uid,
                    "title": r.title,
                    "description": r.description,
                    "type": r.type.value if hasattr(r.type, 'value') else r.type,
                    "subject_id": r.subject_id,
                    "relevance": 0.9,
                }
                for r in resources
            ],
            "videos": [
                {
                    "id": v.id,
                    "uid": v.uid,
                    "title": v.title,
                    "description": v.description,
                    "thumbnail_url": v.thumbnail_url,
                    "duration_seconds": v.duration_seconds,
                    "subject_id": v.subject_id,
                    "relevance": 0.85,
                }
                for v in videos
            ],
            "subjects": [
                {
                    "id": s.id,
                    "uid": s.uid,
                    "name": s.name,
                    "description": s.description,
                    "icon": s.icon,
                    "class_name": s.class_name,
                    "relevance": 0.8,
                }
                for s in subjects
            ],
            "teachers": teacher_results,
            "products": [
                {
                    "id": p.id,
                    "uid": p.uid,
                    "name": p.name,
                    "description": p.description,
                    "price": p.price,
                    "image_url": p.image_url,
                    "rating": p.rating,
                    "relevance": 0.7,
                }
                for p in products
            ],
        },
    }
