from fastapi import APIRouter, Depends, Query, Path, Body
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime

from app.database import get_db
from app.dependencies import get_current_user
from app.core.exceptions import NotFoundException
from app.models import User, Message
from app.schemas import MessageCreate, MessageResponseModel
from app.utils.id_generator import generate_id

router = APIRouter(prefix="/api/v1/messages", tags=["Messages"])


@router.get("/conversations")
def list_conversations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List user's conversations."""
    sent = db.query(Message).filter(
        Message.sender_id == current_user.id,
        Message.is_active == True,
    ).all()
    received = db.query(Message).filter(
        Message.receiver_id == current_user.id,
        Message.is_active == True,
    ).all()

    conversation_map = {}
    all_messages = sent + received
    for msg in all_messages:
        other_id = msg.receiver_id if msg.sender_id == current_user.id else msg.sender_id
        key = f"{min(current_user.id, other_id)}_{max(current_user.id, other_id)}"

        if key not in conversation_map or msg.created_at > conversation_map[key]["last_message_time"]:
            other_user = db.query(User).filter(User.id == other_id).first()
            conversation_map[key] = {
                "conversation_id": key,
                "other_user": {
                    "id": other_user.id,
                    "uid": other_user.uid,
                    "full_name": other_user.full_name,
                    "avatar_url": other_user.avatar_url,
                } if other_user else None,
                "last_message": {
                    "id": msg.id,
                    "uid": msg.uid,
                    "content": msg.content,
                    "sender_id": msg.sender_id,
                    "is_read": msg.is_read,
                    "created_at": msg.created_at.isoformat() if msg.created_at else None,
                },
                "last_message_time": msg.created_at,
            }

    conversations = sorted(
        conversation_map.values(),
        key=lambda x: x["last_message_time"] or datetime.min,
        reverse=True,
    )

    for conv in conversations:
        del conv["last_message_time"]

    return {
        "status": "success",
        "message": "Conversations retrieved successfully",
        "data": conversations,
    }


@router.get("/conversations/{conversation_id}")
def get_conversation_messages(
    conversation_id: str = Path(...),
    page: int = Query(1, ge=1),
    per_page: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get messages in a conversation."""
    parts = conversation_id.split("_")
    if len(parts) != 2:
        from app.core.exceptions import BadRequestException
        raise BadRequestException(detail="Invalid conversation ID")

    user1_id, user2_id = int(parts[0]), int(parts[1])
    if current_user.id not in (user1_id, user2_id):
        from app.core.exceptions import ForbiddenException
        raise ForbiddenException(detail="Access denied")

    query = db.query(Message).filter(
        Message.is_active == True,
        ((Message.sender_id == user1_id) & (Message.receiver_id == user2_id)) |
        ((Message.sender_id == user2_id) & (Message.receiver_id == user1_id)),
    )

    total = query.count()
    messages = query.order_by(Message.created_at.desc()).offset((page - 1) * per_page).limit(per_page).all()

    result = []
    for m in messages:
        sender = db.query(User).filter(User.id == m.sender_id).first()
        result.append({
            "id": m.id,
            "uid": m.uid,
            "sender_id": m.sender_id,
            "sender_name": sender.full_name if sender else None,
            "sender_avatar": sender.avatar_url if sender else None,
            "receiver_id": m.receiver_id,
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
    }


@router.post("/")
def send_message(
    data: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Send a direct message."""
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

    sender = db.query(User).filter(User.id == current_user.id).first()

    return {
        "status": "success",
        "message": "Message sent successfully",
        "data": {
            "id": message.id,
            "uid": message.uid,
            "sender_id": message.sender_id,
            "sender_name": sender.full_name if sender else None,
            "receiver_id": message.receiver_id,
            "content": message.content,
            "is_read": message.is_read,
            "created_at": message.created_at.isoformat() if message.created_at else None,
        },
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
        Message.receiver_id == current_user.id,
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
