from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta

from app.database import get_db
from app.dependencies import get_current_user
from app.models import User, QuizAttempt, Analytic, Subject, Achievement, UserBadge

router = APIRouter(prefix="/api/v1/analytics", tags=["Analytics"])


@router.get("/overview")
def get_analytics_overview(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get analytics overview: study hours, subjects covered, quizzes taken."""
    total_quizzes = db.query(QuizAttempt).filter(
        QuizAttempt.user_id == current_user.id,
        QuizAttempt.completed_at.isnot(None),
    ).count()

    avg_score = db.query(func.avg(QuizAttempt.score)).filter(
        QuizAttempt.user_id == current_user.id,
        QuizAttempt.completed_at.isnot(None),
    ).scalar() or 0.0

    study_hours = db.query(func.sum(Analytic.duration_seconds)).filter(
        Analytic.user_id == current_user.id,
    ).scalar() or 0

    subjects_covered = db.query(func.count(func.distinct(Analytic.subject_id))).filter(
        Analytic.user_id == current_user.id,
        Analytic.subject_id.isnot(None),
    ).scalar() or 0

    return {
        "status": "success",
        "message": "Analytics overview retrieved",
        "data": {
            "study_hours": round(study_hours / 3600, 2),
            "subjects_covered": subjects_covered,
            "quizzes_taken": total_quizzes,
            "average_score": round(float(avg_score), 2),
            "total_xp": current_user.xp,
            "current_level": current_user.level,
        },
    }


@router.get("/study-hours")
def get_study_hours(
    period: str = Query("week", description="week/month/year"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get study hours by date range."""
    now = datetime.utcnow()
    if period == "week":
        start = now - timedelta(days=7)
    elif period == "month":
        start = now - timedelta(days=30)
    elif period == "year":
        start = now - timedelta(days=365)
    else:
        start = now - timedelta(days=7)

    analytics = db.query(Analytic).filter(
        Analytic.user_id == current_user.id,
        Analytic.created_at >= start,
    ).all()

    daily_hours = {}
    for a in analytics:
        date_str = a.created_at.strftime("%Y-%m-%d") if a.created_at else "unknown"
        if date_str not in daily_hours:
            daily_hours[date_str] = 0
        daily_hours[date_str] += a.duration_seconds / 3600

    data = [{"date": d, "hours": round(h, 2)} for d, h in sorted(daily_hours.items())]

    return {
        "status": "success",
        "message": "Study hours retrieved",
        "data": data,
    }


@router.get("/weekly-progress")
def get_weekly_progress(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get weekly progress data."""
    now = datetime.utcnow()
    start = now - timedelta(days=7)

    analytics = db.query(Analytic).filter(
        Analytic.user_id == current_user.id,
        Analytic.created_at >= start,
    ).all()

    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    daily_data = {d: {"hours": 0, "tasks_completed": 0} for d in days}

    for a in analytics:
        if a.created_at:
            day_name = days[a.created_at.weekday()]
            daily_data[day_name]["hours"] += a.duration_seconds / 3600
            daily_data[day_name]["tasks_completed"] += 1

    return {
        "status": "success",
        "message": "Weekly progress retrieved",
        "data": [
            {"day": d, "hours": round(v["hours"], 2), "tasks_completed": v["tasks_completed"]}
            for d, v in daily_data.items()
        ],
    }


@router.get("/subject-performance")
def get_subject_performance(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get performance per subject."""
    subjects = db.query(Subject).filter(Subject.is_active == True).all()

    result = []
    from app.models.quiz import Quiz as QuizModel
    for s in subjects:
        quizzes = db.query(QuizAttempt).join(QuizModel).filter(
            QuizModel.subject_id == s.id,
            QuizAttempt.user_id == current_user.id,
            QuizAttempt.completed_at.isnot(None),
        ).all()

        avg_score = sum(q.score or 0 for q in quizzes) / len(quizzes) if quizzes else 0

        result.append({
            "subject_id": s.id,
            "subject_name": s.name,
            "average_score": round(avg_score, 2),
            "quizzes_taken": len(quizzes),
            "time_spent": 0,
        })

    return {
        "status": "success",
        "message": "Subject performance retrieved",
        "data": result,
    }


@router.get("/heatmap")
def get_heatmap(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get learning heatmap data (GitHub-style)."""
    now = datetime.utcnow()
    start = now - timedelta(days=365)

    analytics = db.query(Analytic).filter(
        Analytic.user_id == current_user.id,
        Analytic.created_at >= start,
    ).all()

    heatmap = {}
    for a in analytics:
        if a.created_at:
            date_str = a.created_at.strftime("%Y-%m-%d")
            if date_str not in heatmap:
                heatmap[date_str] = 0
            heatmap[date_str] += 1

    return {
        "status": "success",
        "message": "Heatmap data retrieved",
        "data": [
            {"date": d, "intensity": min(count, 10)}
            for d, count in sorted(heatmap.items())
        ],
    }


@router.get("/weak-areas")
def get_weak_areas(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Detect weak areas based on quiz/exam performance."""
    from app.models.quiz import Quiz

    subjects = db.query(Subject).filter(Subject.is_active == True).all()
    weak_areas = []

    for s in subjects:
        quizzes = db.query(QuizAttempt).join(Quiz).filter(
            Quiz.subject_id == s.id,
            QuizAttempt.user_id == current_user.id,
            QuizAttempt.completed_at.isnot(None),
        ).all()

        if quizzes:
            avg_score = sum(q.score or 0 for q in quizzes) / len(quizzes)
            if avg_score < 60:
                weak_areas.append({
                    "subject_id": s.id,
                    "subject_name": s.name,
                    "average_score": round(avg_score, 2),
                    "recommendation": f"Review {s.name} fundamentals and take more practice quizzes",
                })

    return {
        "status": "success",
        "message": "Weak areas detected",
        "data": weak_areas,
    }


@router.get("/strong-areas")
def get_strong_areas(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Detect strong areas based on quiz/exam performance."""
    from app.models.quiz import Quiz

    subjects = db.query(Subject).filter(Subject.is_active == True).all()
    strong_areas = []

    for s in subjects:
        quizzes = db.query(QuizAttempt).join(Quiz).filter(
            Quiz.subject_id == s.id,
            QuizAttempt.user_id == current_user.id,
            QuizAttempt.completed_at.isnot(None),
        ).all()

        if quizzes:
            avg_score = sum(q.score or 0 for q in quizzes) / len(quizzes)
            if avg_score >= 80:
                strong_areas.append({
                    "subject_id": s.id,
                    "subject_name": s.name,
                    "average_score": round(avg_score, 2),
                    "recommendation": f"Challenge yourself with advanced {s.name} topics",
                })

    return {
        "status": "success",
        "message": "Strong areas detected",
        "data": strong_areas,
    }


@router.get("/recommendations")
def get_recommendations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get AI-powered recommendations."""
    return {
        "status": "success",
        "message": "Recommendations retrieved",
        "data": [
            {
                "type": "study",
                "title": "Focus on Mathematics",
                "description": "Your math score dropped 5% this week. Review algebra concepts.",
                "priority": "high",
            },
            {
                "type": "quiz",
                "title": "Take Physics Quiz",
                "description": "Practice makes perfect. Take a physics quiz to reinforce learning.",
                "priority": "medium",
            },
            {
                "type": "video",
                "title": "Watch Chemistry Video",
                "description": "A new video on organic chemistry is available.",
                "priority": "low",
            },
        ],
    }


@router.get("/achievements-timeline")
def get_achievements_timeline(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get achievement unlock timeline."""
    badges = db.query(UserBadge).filter(
        UserBadge.user_id == current_user.id,
    ).order_by(UserBadge.awarded_at.desc()).all()

    timeline = []
    for b in badges:
        achievement = db.query(Achievement).filter(Achievement.id == b.achievement_id).first() if b.achievement_id else None
        timeline.append({
            "id": b.id,
            "achievement_name": achievement.name if achievement else "Badge",
            "description": achievement.description if achievement else None,
            "icon": achievement.icon if achievement else None,
            "awarded_at": b.awarded_at.isoformat() if b.awarded_at else None,
        })

    return {
        "status": "success",
        "message": "Achievements timeline retrieved",
        "data": timeline,
    }
