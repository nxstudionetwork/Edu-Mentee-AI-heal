from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from app.database import get_db
from app.dependencies import get_current_user
from app.models import User

router = APIRouter(prefix="/api/v1/parents", tags=["Parents"])


@router.get("/dashboard")
def get_parent_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    now = datetime.utcnow()
    return {
        "status": "success",
        "message": "Parent dashboard data retrieved successfully",
        "data": {
            "parent_name": current_user.name or "Parent",
            "children_count": 2,
            "overall_progress": 78,
            "study_hours_this_week": 14,
            "subjects_enrolled": 6,
            "upcoming_exams": 3,
            "login_streak": 5,
            "last_login": now.isoformat(),
            "notifications": [
                {
                    "id": "pn1",
                    "type": "info",
                    "message": "Math test scheduled for next Monday",
                    "date": (now + timedelta(days=2)).isoformat(),
                    "read": False,
                },
                {
                    "id": "pn2",
                    "type": "warning",
                    "message": "Priya's Science score dropped below 70%",
                    "date": (now - timedelta(days=1)).isoformat(),
                    "read": False,
                },
                {
                    "id": "pn3",
                    "type": "success",
                    "message": "Rahul completed all weekly assignments",
                    "date": (now - timedelta(hours=6)).isoformat(),
                    "read": True,
                },
            ],
        },
    }


@router.get("/children")
def get_children(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return {
        "status": "success",
        "message": "Children list retrieved successfully",
        "data": {
            "children": [
                {
                    "id": "child_1",
                    "name": "Priya Sharma",
                    "class": 10,
                    "section": "A",
                    "overall_progress": 82,
                    "study_hours_week": 8,
                    "subjects_enrolled": 6,
                    "upcoming_exams": 2,
                    "avatar_initials": "PS",
                },
                {
                    "id": "child_2",
                    "name": "Rahul Sharma",
                    "class": 7,
                    "section": "B",
                    "overall_progress": 74,
                    "study_hours_week": 6,
                    "subjects_enrolled": 5,
                    "upcoming_exams": 1,
                    "avatar_initials": "RS",
                },
            ],
        },
    }


@router.get("/children/{child_id}/progress")
def get_child_progress(
    child_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    subjects_data = {
        "child_1": [
            {"name": "Mathematics", "progress": 88, "score": 85, "color": "#3b82f6", "icon": "\ud83d\udcd0"},
            {"name": "Science", "progress": 72, "score": 70, "color": "#10b981", "icon": "\ud83d\udd2c"},
            {"name": "English", "progress": 90, "score": 92, "color": "#8b5cf6", "icon": "\ud83d\udcdd"},
            {"name": "Hindi", "progress": 85, "score": 80, "color": "#f59e0b", "icon": "\ud83d\udcda"},
            {"name": "Social Studies", "progress": 78, "score": 75, "color": "#ec4899", "icon": "\ud83c\udf0d"},
            {"name": "Computer Science", "progress": 95, "score": 96, "color": "#06b6d4", "icon": "\ud83d\udcbb"},
        ],
        "child_2": [
            {"name": "Mathematics", "progress": 70, "score": 68, "color": "#3b82f6", "icon": "\ud83d\udcd0"},
            {"name": "Science", "progress": 80, "score": 78, "color": "#10b981", "icon": "\ud83d\udd2c"},
            {"name": "English", "progress": 65, "score": 62, "color": "#8b5cf6", "icon": "\ud83d\udcdd"},
            {"name": "Hindi", "progress": 82, "score": 80, "color": "#f59e0b", "icon": "\ud83d\udcda"},
            {"name": "Social Studies", "progress": 73, "score": 70, "color": "#ec4899", "icon": "\ud83c\udf0d"},
        ],
    }
    subjects = subjects_data.get(child_id, subjects_data.get("child_1"))
    return {
        "status": "success",
        "message": "Child progress retrieved successfully",
        "data": {
            "child_id": child_id,
            "subjects": subjects,
            "overall_progress": round(sum(s["progress"] for s in subjects) / len(subjects)) if subjects else 0,
            "average_score": round(sum(s["score"] for s in subjects) / len(subjects)) if subjects else 0,
        },
    }


@router.get("/children/{child_id}/activity")
def get_child_activity(
    child_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    now = datetime.utcnow()
    activities = [
        {
            "id": "act_1",
            "type": "quiz_completed",
            "title": "Completed Algebra Quiz",
            "description": "Scored 85% in Mathematics Algebra test",
            "icon": "\ud83d\udcdd",
            "timestamp": (now - timedelta(hours=2)).isoformat(),
            "child_id": child_id,
        },
        {
            "id": "act_2",
            "type": "lesson_completed",
            "title": "Finished Science Chapter 5",
            "description": "Completed Photosynthesis lesson and notes",
            "icon": "\u2705",
            "timestamp": (now - timedelta(hours=5)).isoformat(),
            "child_id": child_id,
        },
        {
            "id": "act_3",
            "type": "video_watched",
            "title": "Watched English Grammar Video",
            "description": "Tenses and Parts of Speech - 45 min",
            "icon": "\ud83c\udfac",
            "timestamp": (now - timedelta(hours=8)).isoformat(),
            "child_id": child_id,
        },
        {
            "id": "act_4",
            "type": "assignment_submitted",
            "title": "Submitted History Assignment",
            "description": "World War II Essay - submitted on time",
            "icon": "\ud83d\udcc4",
            "timestamp": (now - timedelta(days=1)).isoformat(),
            "child_id": child_id,
        },
        {
            "id": "act_5",
            "type": "resource_downloaded",
            "title": "Downloaded Math Practice Sheet",
            "description": "Quadratic Equations - 50 practice problems",
            "icon": "\u2b07\ufe0f",
            "timestamp": (now - timedelta(days=1, hours=3)).isoformat(),
            "child_id": child_id,
        },
        {
            "id": "act_6",
            "type": "quiz_completed",
            "title": "Completed Hindi Grammar Quiz",
            "description": "Scored 90% in Vyakaran test",
            "icon": "\ud83d\udcdd",
            "timestamp": (now - timedelta(days=2)).isoformat(),
            "child_id": child_id,
        },
    ]
    return {
        "status": "success",
        "message": "Child activity retrieved successfully",
        "data": {
            "child_id": child_id,
            "activities": activities,
        },
    }


@router.get("/children/{child_id}/upcoming")
def get_child_upcoming(
    child_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    now = datetime.utcnow()
    upcoming = [
        {
            "id": "up_1",
            "type": "exam",
            "title": "Mathematics Mid-Term",
            "subject": "Mathematics",
            "date": (now + timedelta(days=3)).isoformat(),
            "time": "10:00 AM",
            "icon": "\ud83d\udccb",
            "color": "#3b82f6",
        },
        {
            "id": "up_2",
            "type": "assignment",
            "title": "Science Lab Report",
            "subject": "Science",
            "date": (now + timedelta(days=5)).isoformat(),
            "time": "11:59 PM",
            "icon": "\ud83d\udcc4",
            "color": "#10b981",
        },
        {
            "id": "up_3",
            "type": "exam",
            "title": "English Literature Test",
            "subject": "English",
            "date": (now + timedelta(days=7)).isoformat(),
            "time": "9:00 AM",
            "icon": "\ud83d\udccb",
            "color": "#8b5cf6",
        },
        {
            "id": "up_4",
            "type": "event",
            "title": "Parent-Teacher Meeting",
            "subject": "",
            "date": (now + timedelta(days=10)).isoformat(),
            "time": "3:00 PM",
            "icon": "\ud83d\udcac",
            "color": "#f59e0b",
        },
        {
            "id": "up_5",
            "type": "assignment",
            "title": "Hindi Essay Submission",
            "subject": "Hindi",
            "date": (now + timedelta(days=12)).isoformat(),
            "time": "5:00 PM",
            "icon": "\ud83d\udcc4",
            "color": "#ec4899",
        },
    ]
    return {
        "status": "success",
        "message": "Upcoming deadlines retrieved successfully",
        "data": {
            "child_id": child_id,
            "upcoming": upcoming,
        },
    }
