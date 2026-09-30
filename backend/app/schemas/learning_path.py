from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel


class LearningPathStepBase(BaseModel):
    title: str
    description: Optional[str] = None
    step_order: int = 0
    content_type: Optional[str] = None
    content_id: Optional[str] = None
    estimated_minutes: int = 0
    is_optional: bool = False


class LearningPathStepCreate(LearningPathStepBase):
    pass


class LearningPathStepResponse(LearningPathStepBase):
    id: int
    uid: str
    is_active: bool = True
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class LearningPathBase(BaseModel):
    title: str
    description: Optional[str] = None
    subject_id: Optional[int] = None
    grade_level: Optional[str] = None
    difficulty: Optional[str] = None
    estimated_duration_days: Optional[int] = None


class LearningPathCreate(LearningPathBase):
    steps: List[LearningPathStepCreate] = []


class LearningPathResponse(LearningPathBase):
    id: int
    uid: str
    total_steps: int = 0
    is_active: bool = True
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class LearningPathDetailResponse(LearningPathResponse):
    steps: List[LearningPathStepResponse] = []


class UserLearningPathResponse(BaseModel):
    id: int
    uid: str
    learning_path_id: int
    current_step: int = 0
    is_completed: bool = False
    progress_percent: float = 0.0
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True
