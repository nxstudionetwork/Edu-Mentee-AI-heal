from fastapi import APIRouter, Depends, Query, Path, Body
from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import datetime

from app.database import get_db
from app.dependencies import get_current_user
from app.core.exceptions import NotFoundException, BadRequestException
from app.models import User, Quiz, QuizQuestion, QuizAttempt
from app.schemas import QuizSubmit, QuizResponse, QuizAttemptResponse
from app.utils.id_generator import generate_id

router = APIRouter(prefix="/api/v1/quizzes", tags=["Quizzes"])


@router.get("/")
def list_quizzes(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    subject_id: Optional[int] = Query(None),
    difficulty: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List quizzes with optional filters for subject_id and difficulty."""
    query = db.query(Quiz).filter(Quiz.is_active == True)

    if subject_id:
        query = query.filter(Quiz.subject_id == subject_id)
    if difficulty:
        query = query.filter(Quiz.difficulty == difficulty)
    if search:
        query = query.filter(
            (Quiz.title.ilike(f"%{search}%")) |
            (Quiz.description.ilike(f"%{search}%"))
        )

    total = query.count()
    quizzes = query.order_by(Quiz.created_at.desc()).offset((page - 1) * per_page).limit(per_page).all()

    return {
        "status": "success",
        "message": "Quizzes retrieved successfully",
        "data": [
            {
                **QuizResponse(
                    id=q.id, uid=q.uid, subject_id=q.subject_id, title=q.title,
                    description=q.description, difficulty=q.difficulty,
                    time_limit_minutes=q.time_limit_minutes,
                    total_questions=q.total_questions, passing_score=q.passing_score,
                    is_active=q.is_active, created_at=q.created_at,
                ).model_dump(),
                "attempts_count": db.query(QuizAttempt).filter(
                    QuizAttempt.quiz_id == q.id, QuizAttempt.user_id == current_user.id
                ).count(),
            }
            for q in quizzes
        ],
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": (total + per_page - 1) // per_page,
    }


@router.get("/attempts/{attempt_id}")
def get_attempt_detail(
    attempt_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get attempt detail with answers."""
    attempt = db.query(QuizAttempt).filter(
        QuizAttempt.id == attempt_id,
        QuizAttempt.user_id == current_user.id,
    ).first()
    if not attempt:
        raise NotFoundException(detail="Quiz attempt not found")

    questions = db.query(QuizQuestion).filter(
        QuizQuestion.quiz_id == attempt.quiz_id,
    ).order_by(QuizQuestion.order_index.asc()).all()

    return {
        "status": "success",
        "message": "Attempt detail retrieved",
        "data": {
            "id": attempt.id,
            "uid": attempt.uid,
            "quiz_id": attempt.quiz_id,
            "score": attempt.score,
            "total_marks": attempt.total_marks,
            "answers": attempt.answers,
            "is_passed": attempt.is_passed,
            "started_at": attempt.started_at.isoformat() if attempt.started_at else None,
            "completed_at": attempt.completed_at.isoformat() if attempt.completed_at else None,
            "questions": [
                {
                    "id": q.id,
                    "uid": q.uid,
                    "question_text": q.question_text,
                    "options": q.options,
                    "correct_answer": q.correct_answer,
                    "explanation": q.explanation,
                    "marks": q.marks,
                }
                for q in questions
            ],
        },
    }


@router.get("/{quiz_id}")
def get_quiz(
    quiz_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get quiz with questions."""
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id, Quiz.is_active == True).first()
    if not quiz:
        raise NotFoundException(detail="Quiz not found")

    questions = db.query(QuizQuestion).filter(
        QuizQuestion.quiz_id == quiz.id,
    ).order_by(QuizQuestion.order_index.asc()).all()

    attempts = db.query(QuizAttempt).filter(
        QuizAttempt.quiz_id == quiz.id,
        QuizAttempt.user_id == current_user.id,
    ).all()

    return {
        "status": "success",
        "message": "Quiz retrieved successfully",
        "data": {
            "id": quiz.id,
            "uid": quiz.uid,
            "subject_id": quiz.subject_id,
            "title": quiz.title,
            "description": quiz.description,
            "difficulty": quiz.difficulty,
            "time_limit_minutes": quiz.time_limit_minutes,
            "total_questions": quiz.total_questions,
            "passing_score": quiz.passing_score,
            "questions": [
                {
                    "id": q.id,
                    "uid": q.uid,
                    "question_text": q.question_text,
                    "options": q.options,
                    "marks": q.marks,
                    "order_index": q.order_index,
                }
                for q in questions
            ],
            "total_attempts": len(attempts),
            "best_score": max([a.score or 0 for a in attempts], default=0),
        },
    }


@router.post("/{quiz_id}/start")
def start_quiz(
    quiz_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Start quiz attempt, return questions."""
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id, Quiz.is_active == True).first()
    if not quiz:
        raise NotFoundException(detail="Quiz not found")

    attempt = QuizAttempt(
        uid=generate_id("ATMP"),
        quiz_id=quiz.id,
        user_id=current_user.id,
        started_at=datetime.utcnow(),
    )
    db.add(attempt)
    db.commit()
    db.refresh(attempt)

    questions = db.query(QuizQuestion).filter(
        QuizQuestion.quiz_id == quiz.id,
    ).order_by(QuizQuestion.order_index.asc()).all()

    return {
        "status": "success",
        "message": "Quiz attempt started",
        "data": {
            "attempt_id": attempt.id,
            "attempt_uid": attempt.uid,
            "quiz_id": quiz.id,
            "time_limit_minutes": quiz.time_limit_minutes,
            "total_questions": len(questions),
            "started_at": attempt.started_at.isoformat() if attempt.started_at else None,
            "questions": [
                {
                    "id": q.id,
                    "uid": q.uid,
                    "question_text": q.question_text,
                    "options": q.options,
                    "marks": q.marks,
                    "order_index": q.order_index,
                }
                for q in questions
            ],
        },
    }


@router.post("/{quiz_id}/submit")
def submit_quiz(
    quiz_id: int = Path(...),
    submission: QuizSubmit = Body(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Submit quiz answers, calculate score, award XP/coins."""
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id, Quiz.is_active == True).first()
    if not quiz:
        raise NotFoundException(detail="Quiz not found")

    attempt = db.query(QuizAttempt).filter(
        QuizAttempt.quiz_id == quiz_id,
        QuizAttempt.user_id == current_user.id,
        QuizAttempt.completed_at.is_(None),
    ).order_by(QuizAttempt.started_at.desc()).first()

    if not attempt:
        attempt = QuizAttempt(
            uid=generate_id("ATMP"),
            quiz_id=quiz.id,
            user_id=current_user.id,
            started_at=datetime.utcnow(),
        )
        db.add(attempt)
        db.flush()

    questions = db.query(QuizQuestion).filter(QuizQuestion.quiz_id == quiz.id).all()
    question_map = {q.id: q for q in questions}

    total_marks = sum(q.marks for q in questions)
    correct_marks = 0
    answers_detail = []

    for q_id_str, selected_answer in submission.answers.items():
        q_id = int(q_id_str)
        if q_id in question_map:
            q = question_map[q_id]
            is_correct = selected_answer == q.correct_answer
            if is_correct:
                correct_marks += q.marks
            answers_detail.append({
                "question_id": q_id,
                "selected_answer": selected_answer,
                "correct_answer": q.correct_answer,
                "is_correct": is_correct,
                "marks": q.marks,
                "explanation": q.explanation,
            })

    score = (correct_marks / total_marks * 100) if total_marks > 0 else 0
    is_passed = score >= quiz.passing_score

    attempt.score = round(score, 2)
    attempt.total_marks = total_marks
    attempt.answers = {"answers": answers_detail, "correct_marks": correct_marks}
    attempt.is_passed = is_passed
    attempt.completed_at = datetime.utcnow()
    db.commit()

    xp_earned = int(score * 0.5) if is_passed else int(score * 0.1)
    coins_earned = int(score * 0.1) if is_passed else 0

    from app.models.gamification import Reward
    if xp_earned > 0:
        current_user.xp += xp_earned
        reward_xp = Reward(uid=generate_id("RWRD"), user_id=current_user.id, type="xp", amount=xp_earned,
                           description=f"Quiz completed: {quiz.title}", reference_type="quiz", reference_id=quiz.id)
        db.add(reward_xp)
    if coins_earned > 0:
        current_user.coins += coins_earned
        reward_coin = Reward(uid=generate_id("RWRD"), user_id=current_user.id, type="coin", amount=coins_earned,
                             description=f"Quiz passed: {quiz.title}", reference_type="quiz", reference_id=quiz.id)
        db.add(reward_coin)
    db.commit()

    return {
        "status": "success",
        "message": "Quiz submitted successfully",
        "data": {
            "attempt_id": attempt.id,
            "attempt_uid": attempt.uid,
            "score": attempt.score,
            "total_marks": total_marks,
            "correct_marks": correct_marks,
            "is_passed": is_passed,
            "passing_score": quiz.passing_score,
            "xp_earned": xp_earned,
            "coins_earned": coins_earned,
            "completed_at": attempt.completed_at.isoformat() if attempt.completed_at else None,
            "answers": answers_detail,
        },
    }


@router.get("/{quiz_id}/attempts")
def get_quiz_attempts(
    quiz_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get user's attempts for a quiz."""
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise NotFoundException(detail="Quiz not found")

    attempts = db.query(QuizAttempt).filter(
        QuizAttempt.quiz_id == quiz_id,
        QuizAttempt.user_id == current_user.id,
    ).order_by(QuizAttempt.created_at.desc()).all()

    return {
        "status": "success",
        "message": "Quiz attempts retrieved successfully",
        "data": [
            {
                "id": a.id,
                "uid": a.uid,
                "score": a.score,
                "total_marks": a.total_marks,
                "is_passed": a.is_passed,
                "started_at": a.started_at.isoformat() if a.started_at else None,
                "completed_at": a.completed_at.isoformat() if a.completed_at else None,
            }
            for a in attempts
        ],
    }
