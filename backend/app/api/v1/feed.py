from fastapi import APIRouter, Depends, Query, Path, Body
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime

from app.database import get_db
from app.dependencies import get_current_user
from app.core.exceptions import NotFoundException, BadRequestException
from app.models import User, Post, Comment, Channel, Community
from app.schemas import FeedPostCreate, FeedPostResponse

router = APIRouter(prefix="/api/v1/feed", tags=["Feed"])


@router.get("/")
def get_feed(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get social feed with recent posts from communities user follows."""
    query = db.query(Post).filter(Post.is_active == True)
    total = query.count()
    posts = query.order_by(Post.created_at.desc()).offset((page - 1) * per_page).limit(per_page).all()

    result = []
    for p in posts:
        author = db.query(User).filter(User.id == p.user_id).first()
        channel = db.query(Channel).filter(Channel.id == p.channel_id).first()
        community = db.query(Community).filter(Community.id == channel.community_id).first() if channel else None
        comment_count = db.query(Comment).filter(Comment.post_id == p.id, Comment.is_active == True).count()

        result.append({
            "id": p.id,
            "uid": p.uid,
            "user_id": p.user_id,
            "author_name": author.full_name if author else None,
            "author_avatar": author.avatar_url if author else None,
            "channel_id": p.channel_id,
            "channel_name": channel.name if channel else None,
            "community_name": community.name if community else None,
            "title": p.title,
            "content": p.content,
            "type": p.type.value if hasattr(p.type, 'value') else p.type,
            "file_url": p.file_url,
            "is_pinned": p.is_pinned,
            "comments_count": comment_count,
            "created_at": p.created_at.isoformat() if p.created_at else None,
        })

    return {
        "status": "success",
        "message": "Feed retrieved successfully",
        "data": result,
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": (total + per_page - 1) // per_page,
    }


@router.post("/")
def create_feed_post(
    data: FeedPostCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a feed post."""
    channels = db.query(Channel).filter(Channel.is_active == True).first()
    if not channels:
        raise BadRequestException(detail="No channels available to post")

    from app.utils.id_generator import generate_id as _gen_id
    post = Post(
        uid=_gen_id("POST"),
        channel_id=channels.id,
        user_id=current_user.id,
        title=data.content[:100] if data.content else "",
        content=data.content,
        type=data.post_type,
        file_url=data.file_url,
        is_active=True,
    )
    db.add(post)
    db.commit()
    db.refresh(post)

    author = db.query(User).filter(User.id == current_user.id).first()

    return {
        "status": "success",
        "message": "Feed post created successfully",
        "data": {
            "id": post.id,
            "uid": post.uid,
            "user_id": post.user_id,
            "author_name": author.full_name if author else None,
            "content": post.content,
            "post_type": post.type.value if hasattr(post.type, 'value') else post.type,
            "file_url": post.file_url,
            "created_at": post.created_at.isoformat() if post.created_at else None,
        },
    }


@router.get("/{post_id}")
def get_feed_post(
    post_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get feed post detail."""
    post = db.query(Post).filter(Post.id == post_id, Post.is_active == True).first()
    if not post:
        raise NotFoundException(detail="Post not found")

    author = db.query(User).filter(User.id == post.user_id).first()
    channel = db.query(Channel).filter(Channel.id == post.channel_id).first()
    community = db.query(Community).filter(Community.id == channel.community_id).first() if channel else None
    comments = db.query(Comment).filter(
        Comment.post_id == post.id, Comment.is_active == True
    ).order_by(Comment.created_at.asc()).all()

    comment_list = []
    for c in comments:
        c_author = db.query(User).filter(User.id == c.user_id).first()
        comment_list.append({
            "id": c.id,
            "uid": c.uid,
            "user_id": c.user_id,
            "author_name": c_author.full_name if c_author else None,
            "content": c.content,
            "created_at": c.created_at.isoformat() if c.created_at else None,
        })

    return {
        "status": "success",
        "message": "Feed post retrieved successfully",
        "data": {
            "id": post.id,
            "uid": post.uid,
            "user_id": post.user_id,
            "author_name": author.full_name if author else None,
            "author_avatar": author.avatar_url if author else None,
            "channel_name": channel.name if channel else None,
            "community_name": community.name if community else None,
            "title": post.title,
            "content": post.content,
            "type": post.type.value if hasattr(post.type, 'value') else post.type,
            "file_url": post.file_url,
            "comments": comment_list,
            "comments_count": len(comment_list),
            "created_at": post.created_at.isoformat() if post.created_at else None,
        },
    }
