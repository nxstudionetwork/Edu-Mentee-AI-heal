from fastapi import APIRouter, Depends, Query, Path, Body
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime

from app.database import get_db
from app.dependencies import get_current_user
from app.core.exceptions import NotFoundException, ForbiddenException
from app.models import User, Community, Channel, Post, Comment
from app.schemas import PostCreate, CommentCreate, PostResponse, CommentResponse, CommunityResponse, ChannelResponse
from app.utils.id_generator import generate_id

router = APIRouter(prefix="/api/v1/community", tags=["Community"])


@router.get("/")
def list_communities(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all active communities."""
    query = db.query(Community).filter(Community.is_active == True)
    total = query.count()
    communities = query.order_by(Community.member_count.desc()).offset((page - 1) * per_page).limit(per_page).all()

    return {
        "status": "success",
        "message": "Communities retrieved successfully",
        "data": [
            {
                "id": c.id,
                "uid": c.uid,
                "name": c.name,
                "description": c.description,
                "icon": c.icon,
                "member_count": c.member_count,
                "created_at": c.created_at.isoformat() if c.created_at else None,
            }
            for c in communities
        ],
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": (total + per_page - 1) // per_page,
    }


@router.get("/{community_id}")
def get_community(
    community_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get community with channels."""
    community = db.query(Community).filter(
        Community.id == community_id,
        Community.is_active == True,
    ).first()
    if not community:
        raise NotFoundException(detail="Community not found")

    channels = db.query(Channel).filter(
        Channel.community_id == community.id,
        Channel.is_active == True,
    ).all()

    return {
        "status": "success",
        "message": "Community retrieved successfully",
        "data": {
            "id": community.id,
            "uid": community.uid,
            "name": community.name,
            "description": community.description,
            "icon": community.icon,
            "member_count": community.member_count,
            "channels": [
                {
                    "id": ch.id,
                    "uid": ch.uid,
                    "name": ch.name,
                    "description": ch.description,
                    "type": ch.type.value if hasattr(ch.type, 'value') else ch.type,
                }
                for ch in channels
            ],
        },
    }


@router.get("/channels/{channel_id}/posts")
def list_channel_posts(
    channel_id: int = Path(...),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List posts in a channel (paginated)."""
    channel = db.query(Channel).filter(Channel.id == channel_id, Channel.is_active == True).first()
    if not channel:
        raise NotFoundException(detail="Channel not found")

    query = db.query(Post).filter(Post.channel_id == channel_id, Post.is_active == True)
    total = query.count()
    posts = query.order_by(Post.created_at.desc()).offset((page - 1) * per_page).limit(per_page).all()

    result = []
    for p in posts:
        author = db.query(User).filter(User.id == p.user_id).first()
        comment_count = db.query(Comment).filter(Comment.post_id == p.id, Comment.is_active == True).count()
        result.append({
            "id": p.id,
            "uid": p.uid,
            "channel_id": p.channel_id,
            "user_id": p.user_id,
            "author_name": author.full_name if author else None,
            "author_avatar": author.avatar_url if author else None,
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
        "message": "Posts retrieved successfully",
        "data": result,
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": (total + per_page - 1) // per_page,
    }


@router.post("/posts")
def create_post(
    data: PostCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new post in a channel."""
    if not data.channel_id:
        from app.core.exceptions import BadRequestException
        raise BadRequestException(detail="channel_id is required")

    channel = db.query(Channel).filter(Channel.id == data.channel_id, Channel.is_active == True).first()
    if not channel:
        raise NotFoundException(detail="Channel not found")

    post = Post(
        uid=generate_id("POST"),
        channel_id=data.channel_id,
        user_id=current_user.id,
        title=data.title,
        content=data.content,
        type=data.type,
        file_url=data.file_url,
        is_active=True,
    )
    db.add(post)
    db.commit()
    db.refresh(post)

    author = db.query(User).filter(User.id == current_user.id).first()

    return {
        "status": "success",
        "message": "Post created successfully",
        "data": {
            "id": post.id,
            "uid": post.uid,
            "channel_id": post.channel_id,
            "user_id": post.user_id,
            "author_name": author.full_name if author else None,
            "title": post.title,
            "content": post.content,
            "type": post.type.value if hasattr(post.type, 'value') else post.type,
            "created_at": post.created_at.isoformat() if post.created_at else None,
        },
    }


@router.get("/posts/{post_id}")
def get_post(
    post_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get post with comments."""
    post = db.query(Post).filter(Post.id == post_id, Post.is_active == True).first()
    if not post:
        raise NotFoundException(detail="Post not found")

    author = db.query(User).filter(User.id == post.user_id).first()
    comments = db.query(Comment).filter(
        Comment.post_id == post.id,
        Comment.is_active == True,
    ).order_by(Comment.created_at.asc()).all()

    comment_list = []
    for c in comments:
        c_author = db.query(User).filter(User.id == c.user_id).first()
        comment_list.append({
            "id": c.id,
            "uid": c.uid,
            "user_id": c.user_id,
            "author_name": c_author.full_name if c_author else None,
            "author_avatar": c_author.avatar_url if c_author else None,
            "content": c.content,
            "created_at": c.created_at.isoformat() if c.created_at else None,
        })

    return {
        "status": "success",
        "message": "Post retrieved successfully",
        "data": {
            "id": post.id,
            "uid": post.uid,
            "channel_id": post.channel_id,
            "user_id": post.user_id,
            "author_name": author.full_name if author else None,
            "author_avatar": author.avatar_url if author else None,
            "title": post.title,
            "content": post.content,
            "type": post.type.value if hasattr(post.type, 'value') else post.type,
            "file_url": post.file_url,
            "is_pinned": post.is_pinned,
            "comments": comment_list,
            "comments_count": len(comment_list),
            "created_at": post.created_at.isoformat() if post.created_at else None,
        },
    }


@router.delete("/posts/{post_id}")
def delete_post(
    post_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a post (owner or admin only)."""
    post = db.query(Post).filter(Post.id == post_id, Post.is_active == True).first()
    if not post:
        raise NotFoundException(detail="Post not found")

    if post.user_id != current_user.id and current_user.role.value != "admin":
        raise ForbiddenException(detail="Only the author or admin can delete this post")

    post.is_active = False
    post.updated_at = datetime.utcnow()
    db.commit()

    return {
        "status": "success",
        "message": "Post deleted successfully",
        "data": None,
    }


@router.post("/posts/{post_id}/comments")
def add_comment(
    post_id: int = Path(...),
    data: CommentCreate = Body(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Add a comment to a post."""
    post = db.query(Post).filter(Post.id == post_id, Post.is_active == True).first()
    if not post:
        raise NotFoundException(detail="Post not found")

    comment = Comment(
        uid=generate_id("CMNT"),
        post_id=post_id,
        user_id=current_user.id,
        content=data.content,
        is_active=True,
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)

    author = db.query(User).filter(User.id == current_user.id).first()

    return {
        "status": "success",
        "message": "Comment added successfully",
        "data": {
            "id": comment.id,
            "uid": comment.uid,
            "post_id": comment.post_id,
            "user_id": comment.user_id,
            "author_name": author.full_name if author else None,
            "content": comment.content,
            "created_at": comment.created_at.isoformat() if comment.created_at else None,
        },
    }


@router.delete("/comments/{comment_id}")
def delete_comment(
    comment_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a comment (owner or admin only)."""
    comment = db.query(Comment).filter(Comment.id == comment_id, Comment.is_active == True).first()
    if not comment:
        raise NotFoundException(detail="Comment not found")

    if comment.user_id != current_user.id and current_user.role.value != "admin":
        raise ForbiddenException(detail="Only the author or admin can delete this comment")

    comment.is_active = False
    comment.updated_at = datetime.utcnow()
    db.commit()

    return {
        "status": "success",
        "message": "Comment deleted successfully",
        "data": None,
    }
