from typing import Optional, List

from sqlalchemy.orm import Session

from app.models.user import User
from app.models.content import Subject, Lesson, Topic
from app.models.quiz import QuizAttempt
from app.models.analytics import Analytic


class AIService:

    @staticmethod
    def get_chat_response(message: str, context: Optional[dict] = None) -> dict:
        greetings = ["hello", "hi", "hey", "good morning", "good evening"]
        lower_message = message.lower().strip()

        if any(greeting in lower_message for greeting in greetings):
            response = "Hello! I'm your AI study assistant. How can I help you today?"
        elif "help" in lower_message:
            response = (
                "I can help you with:\n"
                "- Understanding difficult concepts\n"
                "- Finding study materials\n"
                "- Creating study schedules\n"
                "- Quiz preparation tips"
            )
        elif "thank" in lower_message:
            response = "You're welcome! Feel free to ask if you need more help."
        else:
            response = (
                f"I understand you're asking about: '{message}'. "
                "Let me help you with that. Could you provide more details "
                "about what specific aspect you'd like to explore?"
            )

        return {
            "response": response,
            "context": context or {},
            "confidence": 0.85,
        }

    @staticmethod
    def get_study_recommendations(db: Session, user_id: int) -> list:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise ValueError("User not found")

        recommendations = []

        subjects = db.query(Subject).filter(Subject.is_active == True).all()

        for subject in subjects:
            attempts = (
                db.query(QuizAttempt)
                .join(QuizAttempt.quiz)
                .filter(
                    QuizAttempt.user_id == user_id,
                    QuizAttempt.quiz.has(subject_id=subject.id),
                    QuizAttempt.score.isnot(None),
                )
                .all()
            )

            if not attempts:
                recommendations.append({
                    "type": "subject",
                    "title": f"Start learning {subject.name}",
                    "description": f"You haven't started {subject.name} yet. Begin with the first lesson.",
                    "reference_id": subject.id,
                    "reference_type": "subject",
                    "priority": "high",
                })
            else:
                avg_score = sum(a.score for a in attempts) / len(attempts)
                if avg_score < 60:
                    recommendations.append({
                        "type": "review",
                        "title": f"Review {subject.name}",
                        "description": f"Your average score in {subject.name} is {avg_score:.1f}%. Review the weak areas.",
                        "reference_id": subject.id,
                        "reference_type": "subject",
                        "priority": "high",
                    })
                elif avg_score < 80:
                    recommendations.append({
                        "type": "practice",
                        "title": f"Practice more {subject.name}",
                        "description": f"Good progress! Practice quizzes can help you reach 80%+.",
                        "reference_id": subject.id,
                        "reference_type": "subject",
                        "priority": "medium",
                    })

        if not recommendations:
            recommendations.append({
                "type": "general",
                "title": "Keep up the great work!",
                "description": "You're doing well across all subjects. Try exploring advanced topics.",
                "priority": "low",
            })

        return recommendations

    @staticmethod
    def get_learning_path(db: Session, user_id: int, subject_id: int) -> list:
        subject = db.query(Subject).filter(Subject.id == subject_id).first()
        if not subject:
            raise ValueError("Subject not found")

        lessons = (
            db.query(Lesson)
            .filter(
                Lesson.subject_id == subject_id,
                Lesson.is_active == True,
            )
            .order_by(Lesson.order_index)
            .all()
        )

        learning_path = []

        for i, lesson in enumerate(lessons):
            topics = (
                db.query(Topic)
                .filter(
                    Topic.lesson_id == lesson.id,
                )
                .order_by(Topic.order_index)
                .all()
            )

            learning_path.append({
                "order": i + 1,
                "lesson_id": lesson.id,
                "lesson_uid": lesson.uid,
                "title": lesson.title,
                "description": lesson.description,
                "duration_minutes": lesson.duration_minutes,
                "topics_count": len(topics),
                "topics": [
                    {
                        "id": topic.id,
                        "uid": topic.uid,
                        "title": topic.title,
                        "is_completed": topic.is_completed,
                    }
                    for topic in topics
                ],
            })

        return learning_path

    @staticmethod
    def get_quiz_recommendations(db: Session, user_id: int) -> list:
        weak_areas = _get_weak_subjects(db, user_id)

        recommendations = []

        for subject_id, avg_score in weak_areas:
            from app.models.quiz import Quiz

            quizzes = (
                db.query(Quiz)
                .filter(
                    Quiz.subject_id == subject_id,
                    Quiz.is_active == True,
                )
                .all()
            )

            for quiz in quizzes:
                has_attempted = (
                    db.query(QuizAttempt)
                    .filter(
                        QuizAttempt.quiz_id == quiz.id,
                        QuizAttempt.user_id == user_id,
                    )
                    .first()
                )

                if not has_attempted:
                    recommendations.append({
                        "quiz_id": quiz.id,
                        "quiz_uid": quiz.uid,
                        "title": quiz.title,
                        "subject_id": subject_id,
                        "reason": f"Practice to improve your score (current avg: {avg_score:.1f}%)",
                        "priority": "high" if avg_score < 40 else "medium",
                    })

        if not recommendations:
            from app.models.quiz import Quiz

            unattempted = (
                db.query(Quiz)
                .filter(Quiz.is_active == True)
                .all()
            )

            for quiz in unattempted:
                has_attempted = (
                    db.query(QuizAttempt)
                    .filter(
                        QuizAttempt.quiz_id == quiz.id,
                        QuizAttempt.user_id == user_id,
                    )
                    .first()
                )

                if not has_attempted:
                    recommendations.append({
                        "quiz_id": quiz.id,
                        "quiz_uid": quiz.uid,
                        "title": quiz.title,
                        "subject_id": quiz.subject_id,
                        "reason": "Try this quiz to test your knowledge",
                        "priority": "low",
                    })

        return recommendations[:10]


def _get_weak_subjects(db: Session, user_id: int) -> list:
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

    weak_subjects = []
    for subject_id, scores in subject_scores.items():
        avg_score = sum(scores) / len(scores) if scores else 0
        if avg_score < 80:
            weak_subjects.append((subject_id, avg_score))

    weak_subjects.sort(key=lambda x: x[1])
    return weak_subjects
