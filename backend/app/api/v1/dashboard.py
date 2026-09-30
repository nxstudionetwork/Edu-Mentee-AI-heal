from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from app.database import get_db
from app.dependencies import get_current_user
from app.models import (
    User, Subject, QuizAttempt, CalendarEvent, Notification,
    Exam, ExamRegistration, Lesson,
)

router = APIRouter(prefix="/api/v1/dashboard", tags=["Dashboard"])


@router.get("/")
def get_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get dashboard data including continue_learning, recent_resources, upcoming_exams, etc."""
    now = datetime.utcnow()

    user_subjects = db.query(Subject).filter(
        Subject.is_active == True,
        Subject.class_name == current_user.class_name,
    ).all()

    continue_learning = []
    lessons = db.query(Lesson).filter(Lesson.is_active == True).order_by(Lesson.created_at.desc()).limit(5).all()
    for lesson in lessons:
        continue_learning.append({
            "lesson_id": lesson.id,
            "lesson_uid": lesson.uid,
            "title": lesson.title,
            "subject_id": lesson.subject_id,
            "duration_minutes": lesson.duration_minutes,
        })

    upcoming_exams = db.query(Exam).filter(
        Exam.is_active == True,
        Exam.exam_date > now,
        Exam.subject_id.in_([s.id for s in user_subjects]) if user_subjects else True,
    ).order_by(Exam.exam_date.asc()).limit(5).all()

    upcoming_events = db.query(CalendarEvent).filter(
        CalendarEvent.user_id == current_user.id,
        CalendarEvent.event_date >= now,
    ).order_by(CalendarEvent.event_date.asc()).limit(10).all()

    notifications = db.query(Notification).filter(
        Notification.user_id == current_user.id,
    ).order_by(Notification.created_at.desc()).limit(5).all()

    from app.models import Leaderboard
    leaderboard_entry = db.query(Leaderboard).filter(
        Leaderboard.user_id == current_user.id,
        Leaderboard.category == "weekly",
    ).first()
    rank = leaderboard_entry.rank if leaderboard_entry else 0

    return {
        "status": "success",
        "message": "Dashboard data retrieved successfully",
        "data": {
            "continue_learning": continue_learning,
            "recent_resources": [],
            "upcoming_exams": [
                {
                    "exam_id": e.id,
                    "uid": e.uid,
                    "title": e.title,
                    "exam_date": e.exam_date.isoformat() if e.exam_date else None,
                    "subject_id": e.subject_id,
                }
                for e in upcoming_exams
            ],
            "upcoming_classes": [
                {
                    "event_id": e.id,
                    "uid": e.uid,
                    "title": e.title,
                    "event_date": e.event_date.isoformat() if e.event_date else None,
                    "event_type": e.event_type.value if hasattr(e.event_type, 'value') else e.event_type,
                }
                for e in upcoming_events
            ],
            "notifications": [
                {
                    "uid": n.uid,
                    "title": n.title,
                    "body": n.body,
                    "type": n.type,
                    "is_read": n.is_read,
                    "created_at": n.created_at.isoformat() if n.created_at else None,
                }
                for n in notifications
            ],
            "coins": current_user.coins,
            "xp": current_user.xp,
            "rank": rank,
            "daily_goals": {
                "study_hours": 0,
                "quizzes_completed": 0,
                "lessons_completed": 0,
                "target_study_hours": 2,
                "target_quizzes": 3,
                "target_lessons": 2,
            },
            "weekly_progress": [],
            "calendar_events": [
                {
                    "event_id": e.id,
                    "title": e.title,
                    "date": e.event_date.isoformat() if e.event_date else None,
                    "type": e.event_type.value if hasattr(e.event_type, 'value') else e.event_type,
                }
                for e in upcoming_events
            ],
        },
    }


@router.get("/stats")
def get_learning_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get learning statistics for the current user."""
    total_quizzes = db.query(QuizAttempt).filter(
        QuizAttempt.user_id == current_user.id,
        QuizAttempt.completed_at.isnot(None),
    ).count()

    passed_quizzes = db.query(QuizAttempt).filter(
        QuizAttempt.user_id == current_user.id,
        QuizAttempt.is_passed == True,
    ).count()

    from sqlalchemy import func
    avg_score = db.query(func.avg(QuizAttempt.score)).filter(
        QuizAttempt.user_id == current_user.id,
        QuizAttempt.completed_at.isnot(None),
    ).scalar() or 0.0

    total_lessons = db.query(Lesson).filter(Lesson.is_active == True).count()

    return {
        "status": "success",
        "message": "Learning statistics retrieved successfully",
        "data": {
            "total_quizzes_taken": total_quizzes,
            "quizzes_passed": passed_quizzes,
            "average_score": round(float(avg_score), 2),
            "total_lessons": total_lessons,
            "study_hours": 0,
            "total_xp": current_user.xp,
            "level": current_user.level,
            "coins": current_user.coins,
        },
    }
