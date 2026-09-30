from pydantic import BaseModel
from typing import Optional, List
from datetime import date


class AnalyticsOverviewResponse(BaseModel):
    total_study_hours: float = 0.0
    subjects_covered: int = 0
    quizzes_taken: int = 0
    exams_attempted: int = 0
    average_score: float = 0.0
    completion_rate: float = 0.0


class StudyHoursResponse(BaseModel):
    labels: List[str] = []
    values: List[float] = []
    total: float = 0.0


class SubjectPerformanceItem(BaseModel):
    subject_name: str
    subject_code: str = ""
    progress_percent: float = 0.0
    average_score: float = 0.0
    quizzes_taken: int = 0


class WeeklyProgressResponse(BaseModel):
    labels: List[str] = []
    study_hours: List[float] = []
    topics_covered: List[int] = []


class HeatmapData(BaseModel):
    date: date
    count: int = 0


class WeakAreaResponse(BaseModel):
    subject_id: int
    subject_name: str
    topic: str
    score: float
    suggested_action: str = ""


class StrongAreaResponse(BaseModel):
    subject_id: int
    subject_name: str
    topic: str
    score: float


class AchievementTimelineItem(BaseModel):
    date: date
    achievement_name: str
    icon: Optional[str] = None
    description: Optional[str] = None


class RecommendationResponse(BaseModel):
    type: str
    title: str
    description: str
    reference_id: Optional[int] = None
    reference_type: Optional[str] = None
    priority: str = "medium"
