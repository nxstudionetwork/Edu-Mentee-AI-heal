from fastapi import APIRouter, Depends, Query, Path, Body
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.dependencies import get_current_user
from app.core.exceptions import NotFoundException
from app.models import User, Teacher, Message
from app.schemas import TeacherResponse, MessageCreate
from app.utils.id_generator import generate_id

router = APIRouter(prefix="/api/v1/teachers", tags=["Ask Teacher"])


@router.get("/available")
def get_available_teachers(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get available teachers with online status."""
    teachers = db.query(Teacher).filter(Teacher.is_available == True).all()

    result = []
    for t in teachers:
        user = db.query(User).filter(User.id == t.user_id).first()
        result.append({
            "id": t.id,
            "uid": t.uid,
            "user_id": t.user_id,
            "name": user.full_name if user else None,
            "avatar_url": user.avatar_url if user else None,
            "qualification": t.qualification,
            "experience_years": t.experience_years,
            "subjects": t.subjects,
            "bio": t.bio,
            "is_available": t.is_available,
        })

    return {
        "status": "success",
        "message": "Available teachers retrieved",
        "data": result,
    }


@router.get("/messages")
def get_teacher_messages(
    teacher_id: int = Query(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get conversation with a specific teacher."""
    messages = db.query(Message).filter(
        Message.is_active == True,
        ((Message.sender_id == current_user.id) & (Message.receiver_id == teacher_id)) |
        ((Message.sender_id == teacher_id) & (Message.receiver_id == current_user.id)),
    ).order_by(Message.created_at.desc()).all()

    result = []
    for m in messages:
        sender = db.query(User).filter(User.id == m.sender_id).first()
        result.append({
            "id": m.id,
            "uid": m.uid,
            "sender_id": m.sender_id,
            "sender_name": sender.full_name if sender else None,
            "receiver_id": m.receiver_id,
            "content": m.content,
            "is_read": m.is_read,
            "created_at": m.created_at.isoformat() if m.created_at else None,
        })

    return {
        "status": "success",
        "message": "Teacher messages retrieved",
        "data": result,
    }


@router.get("/")
def list_teachers(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    subject: Optional[str] = Query(None),
    is_available: Optional[bool] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List teachers with optional filters for subject and availability."""
    query = db.query(Teacher)

    if is_available is not None:
        query = query.filter(Teacher.is_available == is_available)

    total = query.count()
    teachers = query.offset((page - 1) * per_page).limit(per_page).all()

    result = []
    for t in teachers:
        user = db.query(User).filter(User.id == t.user_id).first()
        if subject and t.subjects:
            import json
            subjects = t.subjects if isinstance(t.subjects, list) else []
            if subject.lower() not in [s.lower() for s in subjects]:
                continue
        result.append({
            "id": t.id,
            "uid": t.uid,
            "user_id": t.user_id,
            "name": user.full_name if user else None,
            "avatar_url": user.avatar_url if user else None,
            "qualification": t.qualification,
            "experience_years": t.experience_years,
            "subjects": t.subjects,
            "bio": t.bio,
            "is_available": t.is_available,
        })

    return {
        "status": "success",
        "message": "Teachers retrieved successfully",
        "data": result,
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": (total + per_page - 1) // per_page,
    }


@router.get("/{teacher_id}")
def get_teacher(
    teacher_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get teacher profile."""
    teacher = db.query(Teacher).filter(Teacher.id == teacher_id).first()
    if not teacher:
        raise NotFoundException(detail="Teacher not found")

    user = db.query(User).filter(User.id == teacher.user_id).first()

    return {
        "status": "success",
        "message": "Teacher retrieved successfully",
        "data": {
            "id": teacher.id,
            "uid": teacher.uid,
            "user_id": teacher.user_id,
            "name": user.full_name if user else None,
            "email": user.email if user else None,
            "avatar_url": user.avatar_url if user else None,
            "qualification": teacher.qualification,
            "experience_years": teacher.experience_years,
            "subjects": teacher.subjects,
            "bio": teacher.bio,
            "is_available": teacher.is_available,
        },
    }


@router.get("/{teacher_id}/conversations")
def get_teacher_conversations(
    teacher_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get teacher conversations."""
    teacher = db.query(Teacher).filter(Teacher.id == teacher_id).first()
    if not teacher:
        raise NotFoundException(detail="Teacher not found")

    messages = db.query(Message).filter(
        Message.is_active == True,
        ((Message.sender_id == current_user.id) & (Message.receiver_id == teacher.user_id)) |
        ((Message.sender_id == teacher.user_id) & (Message.receiver_id == current_user.id)),
    ).order_by(Message.created_at.desc()).limit(50).all()

    result = []
    for m in messages:
        sender = db.query(User).filter(User.id == m.sender_id).first()
        result.append({
            "id": m.id,
            "uid": m.uid,
            "sender_id": m.sender_id,
            "sender_name": sender.full_name if sender else None,
            "content": m.content,
            "is_read": m.is_read,
            "created_at": m.created_at.isoformat() if m.created_at else None,
        })

    return {
        "status": "success",
        "message": "Teacher conversations retrieved",
        "data": result,
    }


@router.post("/messages")
def send_message_to_teacher(
    data: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Send a message to a teacher."""
    receiver = db.query(User).filter(User.id == data.receiver_id).first()
    if not receiver:
        raise NotFoundException(detail="Teacher not found")

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
        "message": "Message sent to teacher",
        "data": {
            "id": message.id,
            "uid": message.uid,
            "sender_id": message.sender_id,
            "receiver_id": message.receiver_id,
            "content": message.content,
            "created_at": message.created_at.isoformat() if message.created_at else None,
        },
    }
