from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class SubjectBase(BaseModel):
    name: str
    code: str
    description: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = None
    class_name: Optional[str] = None
    stream: Optional[str] = None


class SubjectCreate(SubjectBase):
    order_index: int = 0


class LessonBase(BaseModel):
    subject_id: int
    title: str
    description: Optional[str] = None
    order_index: int = 0
    duration_minutes: int = 0
    content: Optional[str] = None


class LessonCreate(LessonBase):
    pass


class LessonResponse(LessonBase):
    id: int
    uid: str
    is_active: bool = True
    created_at: datetime

    class Config:
        from_attributes = True


class TopicBase(BaseModel):
    lesson_id: int
    title: str
    content: Optional[str] = None
    order_index: int = 0
    duration_minutes: int = 0


class TopicResponse(TopicBase):
    id: int
    uid: str
    is_completed: bool = False
    created_at: datetime

    class Config:
        from_attributes = True


class SubjectResponse(SubjectBase):
    id: int
    uid: str
    is_active: bool = True
    order_index: int = 0
    created_at: datetime

    class Config:
        from_attributes = True


class SubjectDetailResponse(SubjectResponse):
    lessons: List[LessonResponse] = []


class ResourceBase(BaseModel):
    subject_id: int
    lesson_id: Optional[int] = None
    title: str
    description: Optional[str] = None
    type: str
    file_url: Optional[str] = None
    file_size: Optional[int] = None
    mime_type: Optional[str] = None


class ResourceResponse(ResourceBase):
    id: int
    uid: str
    download_count: int = 0
    is_active: bool = True
    created_at: datetime

    class Config:
        from_attributes = True


class ResourceListResponse(BaseModel):
    resources: List[ResourceResponse] = []
    total: int = 0
    page: int = 1
    size: int = 10


class VideoBase(BaseModel):
    subject_id: int
    lesson_id: Optional[int] = None
    title: str
    description: Optional[str] = None
    url: str
    thumbnail_url: Optional[str] = None
    duration_seconds: int = 0
    difficulty: Optional[str] = None


class VideoResponse(VideoBase):
    id: int
    uid: str
    view_count: int = 0
    is_active: bool = True
    created_at: datetime

    class Config:
        from_attributes = True


class VideoProgressUpdate(BaseModel):
    progress_percent: int = Field(0, ge=0, le=100)
    last_position: int = 0
