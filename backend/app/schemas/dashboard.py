from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime


class DailyGoalResponse(BaseModel):
    goal_type: str
    target: float
    achieved: float = 0
    progress_percent: float = 0.0


class WeeklyProgressResponse(BaseModel):
    day: str
    hours: float = 0.0
    topics_covered: int = 0


class StatsResponse(BaseModel):
    total_study_hours: float = 0.0
    total_quizzes: int = 0
    total_exams: int = 0
    average_score: float = 0.0
    total_resources_viewed: int = 0
    total_videos_watched: int = 0
    current_streak: int = 0
    longest_streak: int = 0


class DashboardResponse(BaseModel):
    continue_learning: List[Any] = []
    recent_resources: List[Any] = []
    upcoming_exams: List[Any] = []
    upcoming_events: List[Any] = []
    notifications: List[Any] = []
    coins: int = 0
    xp: int = 0
    level: int = 1
    rank: int = 0
    daily_goals: List[DailyGoalResponse] = []
    weekly_progress: Dict[str, Any] = {}
