from fastapi import APIRouter, Depends, Query, Path, Body
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime

from app.database import get_db
from app.dependencies import get_current_user
from app.core.exceptions import NotFoundException, BadRequestException
from app.models import User
from app.schemas import AIChatMessage
from app.utils.id_generator import generate_id

router = APIRouter(prefix="/api/v1/ai", tags=["AI Helper"])


@router.post("/chat")
def ai_chat(
    data: AIChatMessage,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Send message to AI and return mock response (placeholder for future AI integration)."""
    session_id = data.session_id or generate_id("AISES")

    mock_responses = [
        "I understand your question. Here's a helpful explanation...",
        "Great question! Let me break this down for you step by step.",
        "Based on the topic you're studying, here are some key points to remember.",
        "I'd recommend reviewing the fundamentals first, then moving to advanced concepts.",
        "Here's a practice problem to help reinforce your understanding.",
    ]

    response_text = mock_responses[hash(data.message) % len(mock_responses)]

    return {
        "status": "success",
        "message": "AI response generated",
        "data": {
            "response": response_text,
            "session_id": session_id,
            "timestamp": datetime.utcnow().isoformat(),
        },
    }


@router.post("/suggest")
def get_ai_suggestions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get AI suggestions based on user's weak areas."""
    suggestions = [
        {
            "type": "study_topic",
            "title": "Review Algebra Fundamentals",
            "description": "Based on your quiz performance, consider reviewing algebra basics.",
            "subject": "Mathematics",
            "priority": "high",
        },
        {
            "type": "practice_quiz",
            "title": "Take a Physics Practice Quiz",
            "description": "Reinforce your understanding of Newton's laws.",
            "subject": "Physics",
            "priority": "medium",
        },
        {
            "type": "video_recommendation",
            "title": "Watch: Chemistry Bonding Explained",
            "description": "A visual explanation of chemical bonding.",
            "subject": "Chemistry",
            "priority": "medium",
        },
    ]

    return {
        "status": "success",
        "message": "Suggestions retrieved",
        "data": suggestions,
    }


@router.get("/sessions")
def get_ai_sessions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get AI chat history (sessions)."""
    return {
        "status": "success",
        "message": "AI sessions retrieved",
        "data": [],
    }


@router.post("/sessions")
def create_ai_session(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new AI session."""
    session_id = generate_id("AISES")

    return {
        "status": "success",
        "message": "AI session created",
        "data": {
            "session_id": session_id,
            "created_at": datetime.utcnow().isoformat(),
        },
    }


@router.delete("/sessions/{session_id}")
def delete_ai_session(
    session_id: str = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete an AI session."""
    return {
        "status": "success",
        "message": "AI session deleted successfully",
        "data": None,
    }
