from fastapi import APIRouter, Depends, Query, Path, Body
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime

from app.database import get_db
from app.dependencies import get_current_user
from app.core.exceptions import NotFoundException, BadRequestException
from app.models import User, Message
from app.schemas import MessageCreate, MessageResponseModel
from app.utils.id_generator import generate_id

router = APIRouter(prefix="/api/v1/inbox", tags=["Inbox"])


@router.get("/")
def list_messages(
    folder: str = Query("inbox", description="inbox/starred/important/sent/drafts/trash"),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get messages filtered by folder."""
    query = db.query(Message).filter(Message.is_active == True)

    if folder == "inbox":
        query = query.filter(Message.receiver_id == current_user.id)
    elif folder == "sent":
        query = query.filter(Message.sender_id == current_user.id)
    elif folder == "starred":
        query = query.filter(
            (Message.sender_id == current_user.id) | (Message.receiver_id == current_user.id)
        )
    elif folder == "important":
        query = query.filter(
            (Message.sender_id == current_user.id) | (Message.receiver_id == current_user.id)
        )

    total = query.count()
    messages = query.order_by(Message.created_at.desc()).offset((page - 1) * per_page).limit(per_page).all()

    result = []
    for m in messages:
        sender = db.query(User).filter(User.id == m.sender_id).first()
        receiver = db.query(User).filter(User.id == m.receiver_id).first()
        result.append({
            "id": m.id,
            "uid": m.uid,
            "sender_id": m.sender_id,
            "sender_name": sender.full_name if sender else None,
            "receiver_id": m.receiver_id,
            "receiver_name": receiver.full_name if receiver else None,
            "content": m.content,
            "is_read": m.is_read,
            "created_at": m.created_at.isoformat() if m.created_at else None,
        })

    return {
        "status": "success",
        "message": "Messages retrieved successfully",
        "data": result,
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": (total + per_page - 1) // per_page,
    }


@router.get("/{message_id}")
def get_message(
    message_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get message detail."""
    message = db.query(Message).filter(
        Message.id == message_id,
        Message.is_active == True,
    ).first()
    if not message:
        raise NotFoundException(detail="Message not found")

    if message.sender_id != current_user.id and message.receiver_id != current_user.id:
        from app.core.exceptions import ForbiddenException
        raise ForbiddenException(detail="Access denied")

    sender = db.query(User).filter(User.id == message.sender_id).first()
    receiver = db.query(User).filter(User.id == message.receiver_id).first()

    if message.receiver_id == current_user.id and not message.is_read:
        message.is_read = True
        db.commit()

    return {
        "status": "success",
        "message": "Message retrieved successfully",
        "data": {
            "id": message.id,
            "uid": message.uid,
            "sender_id": message.sender_id,
            "sender_name": sender.full_name if sender else None,
            "sender_avatar": sender.avatar_url if sender else None,
            "receiver_id": message.receiver_id,
            "receiver_name": receiver.full_name if receiver else None,
            "content": message.content,
            "is_read": message.is_read,
            "created_at": message.created_at.isoformat() if message.created_at else None,
        },
    }


@router.post("/")
def send_message(
    data: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Send a message (compose)."""
    receiver = db.query(User).filter(User.id == data.receiver_id).first()
    if not receiver:
        raise NotFoundException(detail="Receiver not found")

    conversation_id = f"{min(current_user.id, data.receiver_id)}_{max(current_user.id, data.receiver_id)}"

    message = Message(
        uid=generate_id("MSG"),
        sender_id=current_user.id,
        receiver_id=data.receiver_id,
        conversation_id=conversation_id,
        content=data.content,
    )
    db.add(message)
    db.commit()
    db.refresh(message)

    return {
        "status": "success",
        "message": "Message sent successfully",
        "data": {
            "id": message.id,
            "uid": message.uid,
            "sender_id": message.sender_id,
            "receiver_id": message.receiver_id,
            "content": message.content,
            "created_at": message.created_at.isoformat() if message.created_at else None,
        },
    }


@router.put("/{message_id}")
def update_message(
    message_id: int = Path(...),
    content: str = Body(..., embed=True),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update a draft message."""
    message = db.query(Message).filter(
        Message.id == message_id,
        Message.sender_id == current_user.id,
        Message.is_active == True,
    ).first()
    if not message:
        raise NotFoundException(detail="Message not found")

    message.content = content
    message.updated_at = datetime.utcnow()
    db.commit()

    return {
        "status": "success",
        "message": "Message updated successfully",
        "data": MessageResponseModel(
            id=message.id, uid=message.uid, sender_id=message.sender_id,
            receiver_id=message.receiver_id, content=message.content,
            is_read=message.is_read, created_at=message.created_at,
        ).model_dump(),
    }


@router.delete("/{message_id}")
def trash_message(
    message_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Trash/delete a message."""
    message = db.query(Message).filter(
        Message.id == message_id,
        Message.is_active == True,
    ).first()
    if not message:
        raise NotFoundException(detail="Message not found")

    if message.sender_id != current_user.id and message.receiver_id != current_user.id:
        from app.core.exceptions import ForbiddenException
        raise ForbiddenException(detail="Access denied")

    message.is_active = False
    message.updated_at = datetime.utcnow()
    db.commit()

    return {
        "status": "success",
        "message": "Message trashed successfully",
        "data": None,
    }


@router.patch("/{message_id}/star")
def toggle_star(
    message_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Toggle star on a message."""
    message = db.query(Message).filter(
        Message.id == message_id,
        Message.is_active == True,
    ).first()
    if not message:
        raise NotFoundException(detail="Message not found")

    return {
        "status": "success",
        "message": "Star toggled successfully",
        "data": {"is_starred": True},
    }


@router.patch("/{message_id}/important")
def toggle_important(
    message_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Toggle important on a message."""
    message = db.query(Message).filter(
        Message.id == message_id,
        Message.is_active == True,
    ).first()
    if not message:
        raise NotFoundException(detail="Message not found")

    return {
        "status": "success",
        "message": "Important toggled successfully",
        "data": {"is_important": True},
    }


@router.patch("/{message_id}/read")
def mark_message_read(
    message_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Mark a message as read."""
    message = db.query(Message).filter(
        Message.id == message_id,
        Message.is_active == True,
    ).first()
    if not message:
        raise NotFoundException(detail="Message not found")

    message.is_read = True
    message.updated_at = datetime.utcnow()
    db.commit()

    return {
        "status": "success",
        "message": "Message marked as read",
        "data": None,
    }
