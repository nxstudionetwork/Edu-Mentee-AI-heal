from datetime import datetime, timedelta
from typing import Optional, List

from sqlalchemy import func, and_
from sqlalchemy.orm import Session

from app.models.analytics import Analytic
from app.models.user import User
from app.models.quiz import QuizAttempt


class AnalyticsService:

    @staticmethod
    def log_event(
        db: Session,
        user_id: int,
        event_type: str,
        event_data: Optional[dict] = None,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
    ) -> Analytic:
        analytic = Analytic(
            user_id=user_id,
            event_type=event_type,
            event_data=event_data,
            ip_address=ip_address,
            user_agent=user_agent,
        )
        db.add(analytic)
        db.commit()
        db.refresh(analytic)
        return analytic

    @staticmethod
    def get_study_hours(db: Session, user_id: int, period: str = "week") -> dict:
        now = datetime.utcnow()

        if period == "day":
            start_date = now - timedelta(days=1)
        elif period == "week":
            start_date = now - timedelta(weeks=1)
        elif period == "month":
            start_date = now - timedelta(days=30)
        elif period == "year":
            start_date = now - timedelta(days=365)
        else:
            start_date = now - timedelta(weeks=1)

        events = db.query(Analytic).filter(
            Analytic.user_id == user_id,
            Analytic.event_type == "study_session",
            Analytic.created_at >= start_date,
        ).all()

        daily_hours = {}
        total_hours = 0.0

        for event in events:
            day_key = event.created_at.strftime("%Y-%m-%d")
            duration = 0.0
            if event.event_data and "duration_minutes" in event.event_data:
                duration = event.event_data["duration_minutes"] / 60.0

            daily_hours[day_key] = daily_hours.get(day_key, 0.0) + duration
            total_hours += duration

        return {
            "daily_hours": daily_hours,
            "total_hours": round(total_hours, 2),
            "period": period,
        }

    @staticmethod
    def get_weak_areas(db: Session, user_id: int) -> list:
        attempts = (
            db.query(QuizAttempt)
            .filter(QuizAttempt.user_id == user_id, QuizAttempt.score.isnot(None))
            .all()
        )

        subject_scores = {}
        for attempt in attempts:
            quiz = attempt.quiz
            if quiz and quiz.subject_id:
                subject_id = quiz.subject_id
                if subject_id not in subject_scores:
                    subject_scores[subject_id] = []
                subject_scores[subject_id].append(attempt.score)

        weak_areas = []
        for subject_id, scores in subject_scores.items():
            avg_score = sum(scores) / len(scores) if scores else 0
            if avg_score < 60:
                weak_areas.append({
                    "subject_id": subject_id,
                    "score": round(avg_score, 2),
                    "attempts": len(scores),
                    "suggested_action": "Review the topics and try more practice quizzes",
                })

        return weak_areas

    @staticmethod
    def get_strong_areas(db: Session, user_id: int) -> list:
        attempts = (
            db.query(QuizAttempt)
            .filter(QuizAttempt.user_id == user_id, QuizAttempt.score.isnot(None))
            .all()
        )

        subject_scores = {}
        for attempt in attempts:
            quiz = attempt.quiz
            if quiz and quiz.subject_id:
                subject_id = quiz.subject_id
                if subject_id not in subject_scores:
                    subject_scores[subject_id] = []
                subject_scores[subject_id].append(attempt.score)

        strong_areas = []
        for subject_id, scores in subject_scores.items():
            avg_score = sum(scores) / len(scores) if scores else 0
            if avg_score > 80:
                strong_areas.append({
                    "subject_id": subject_id,
                    "score": round(avg_score, 2),
                    "attempts": len(scores),
                })

        return strong_areas

    @staticmethod
    def get_heatmap_data(db: Session, user_id: int, months: int = 6) -> list:
        start_date = datetime.utcnow() - timedelta(days=months * 30)

        events = (
            db.query(
                func.date(Analytic.created_at).label("event_date"),
                func.count(Analytic.id).label("event_count"),
            )
            .filter(
                Analytic.user_id == user_id,
                Analytic.created_at >= start_date,
            )
            .group_by(func.date(Analytic.created_at))
            .all()
        )

        heatmap = []
        for event_date, count in events:
            heatmap.append({
                "date": str(event_date),
                "count": count,
            })

        return heatmap
