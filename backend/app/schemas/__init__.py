from datetime import datetime, date
from typing import Optional, List, Any
from pydantic import BaseModel, EmailStr, Field


class MessageResponse(BaseModel):
    status: str = "success"
    message: str
    data: Any = None


class PaginatedResponse(BaseModel):
    status: str = "success"
    message: str
    data: Any = None
    total: int = 0
    page: int = 1
    per_page: int = 20
    total_pages: int = 1


class UserCreate(BaseModel):
    full_name: str
    email: str
    password: str
    phone: Optional[str] = None
    login_id: Optional[str] = None
    school: Optional[str] = None
    board: Optional[str] = None
    class_name: Optional[str] = None
    stream: Optional[str] = None
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None
    country: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    village_town: Optional[str] = None
    city: Optional[str] = None
    pincode: Optional[str] = None


class UserLogin(BaseModel):
    email: Optional[str] = None
    login_id: Optional[str] = None
    password: str


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    date_of_birth: Optional[datetime] = None
    gender: Optional[str] = None
    avatar_url: Optional[str] = None
    school: Optional[str] = None
    board: Optional[str] = None
    class_name: Optional[str] = None
    section: Optional[str] = None
    stream: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    village_town: Optional[str] = None
    pincode: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    uid: str
    full_name: str
    email: str
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    role: str
    class_name: Optional[str] = None
    stream: Optional[str] = None
    school: Optional[str] = None
    board: Optional[str] = None
    district: Optional[str] = None
    village_town: Optional[str] = None
    coins: int = 0
    xp: int = 0
    level: int = 1
    is_active: bool = True
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Optional[UserResponse] = None


class PasswordReset(BaseModel):
    token: str
    new_password: str


class SubjectCreate(BaseModel):
    name: str
    code: str
    description: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = None
    class_name: Optional[str] = None
    stream: Optional[str] = None


class SubjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = None
    class_name: Optional[str] = None
    stream: Optional[str] = None


class SubjectResponse(BaseModel):
    id: int
    uid: str
    name: str
    code: str
    description: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = None
    class_name: Optional[str] = None
    stream: Optional[str] = None
    is_active: bool = True
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class LessonCreate(BaseModel):
    subject_id: int
    title: str
    description: Optional[str] = None
    order_index: int = 0
    duration_minutes: int = 0
    content: Optional[str] = None


class LessonUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    order_index: Optional[int] = None
    duration_minutes: Optional[int] = None
    content: Optional[str] = None
    is_active: Optional[bool] = None


class LessonResponse(BaseModel):
    id: int
    uid: str
    subject_id: int
    title: str
    description: Optional[str] = None
    order_index: int = 0
    duration_minutes: int = 0
    is_active: bool = True
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class TopicResponse(BaseModel):
    id: int
    uid: str
    lesson_id: int
    title: str
    content: Optional[str] = None
    order_index: int = 0
    duration_minutes: int = 0
    is_completed: bool = False
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ResourceCreate(BaseModel):
    subject_id: int
    lesson_id: Optional[int] = None
    title: str
    description: Optional[str] = None
    type: str
    file_url: Optional[str] = None
    file_size: Optional[int] = None
    mime_type: Optional[str] = None
    thumbnail_url: Optional[str] = None


class ResourceResponse(BaseModel):
    id: int
    uid: str
    subject_id: int
    lesson_id: Optional[int] = None
    title: str
    description: Optional[str] = None
    type: str
    file_url: Optional[str] = None
    file_size: Optional[int] = None
    thumbnail_url: Optional[str] = None
    is_featured: bool = False
    download_count: int = 0
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class VideoCreate(BaseModel):
    subject_id: int
    lesson_id: Optional[int] = None
    title: str
    description: Optional[str] = None
    url: str
    thumbnail_url: Optional[str] = None
    duration_seconds: int = 0
    difficulty: Optional[str] = None


class VideoResponse(BaseModel):
    id: int
    uid: str
    subject_id: int
    lesson_id: Optional[int] = None
    title: str
    description: Optional[str] = None
    url: str
    thumbnail_url: Optional[str] = None
    duration_seconds: int = 0
    difficulty: Optional[str] = None
    is_featured: bool = False
    view_count: int = 0
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class QuizResponse(BaseModel):
    id: int
    uid: str
    subject_id: int
    title: str
    description: Optional[str] = None
    difficulty: Optional[str] = None
    time_limit_minutes: Optional[int] = None
    total_questions: int = 0
    passing_score: float = 40.0
    is_active: bool = True
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class QuizSubmit(BaseModel):
    answers: dict


class QuizAttemptResponse(BaseModel):
    id: int
    uid: str
    quiz_id: int
    user_id: int
    score: Optional[float] = None
    total_marks: Optional[int] = None
    answers: Optional[dict] = None
    is_passed: bool = False
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ExamResponse(BaseModel):
    id: int
    uid: str
    subject_id: int
    title: str
    description: Optional[str] = None
    exam_date: Optional[datetime] = None
    duration_minutes: Optional[int] = None
    total_marks: Optional[int] = None
    passing_marks: Optional[int] = None
    is_active: bool = True
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ExamResultResponse(BaseModel):
    id: int
    uid: str
    exam_id: int
    user_id: int
    marks_obtained: Optional[float] = None
    total_marks: Optional[int] = None
    percentage: Optional[float] = None
    grade: Optional[str] = None
    rank: Optional[int] = None
    is_passed: bool = False
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class AssignmentCreate(BaseModel):
    subject_id: int
    title: str
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    total_marks: Optional[int] = None
    file_url: Optional[str] = None


class AssignmentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    total_marks: Optional[int] = None
    file_url: Optional[str] = None


class AssignmentResponse(BaseModel):
    id: int
    uid: str
    subject_id: int
    teacher_id: int
    title: str
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    total_marks: Optional[int] = None
    is_active: bool = True
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class SubmissionCreate(BaseModel):
    file_url: Optional[str] = None
    content: Optional[str] = None


class GradeSubmission(BaseModel):
    marks_obtained: float
    feedback: Optional[str] = None


class SubmissionResponse(BaseModel):
    id: int
    uid: str
    assignment_id: int
    user_id: int
    file_url: Optional[str] = None
    content: Optional[str] = None
    marks_obtained: Optional[float] = None
    feedback: Optional[str] = None
    is_graded: bool = False
    submitted_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class CalendarEventCreate(BaseModel):
    title: str
    description: Optional[str] = None
    event_date: Optional[datetime] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    color: Optional[str] = None
    event_type: str
    is_all_day: bool = False


class CalendarEventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    event_date: Optional[datetime] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    color: Optional[str] = None
    event_type: Optional[str] = None
    is_all_day: Optional[bool] = None


class CalendarEventResponse(BaseModel):
    id: int
    uid: str
    user_id: int
    title: str
    description: Optional[str] = None
    event_date: Optional[datetime] = None
    event_type: str
    color: Optional[str] = None
    is_all_day: bool = False
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class NotificationResponse(BaseModel):
    id: int
    uid: str
    title: str
    body: Optional[str] = None
    type: Optional[str] = None
    reference_type: Optional[str] = None
    reference_id: Optional[int] = None
    is_read: bool = False
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class MessageCreate(BaseModel):
    receiver_id: int
    content: str


class MessageResponseModel(BaseModel):
    id: int
    uid: str
    sender_id: int
    receiver_id: int
    content: str
    is_read: bool = False
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class PostCreate(BaseModel):
    channel_id: Optional[int] = None
    title: str
    content: Optional[str] = None
    type: str = "text"
    file_url: Optional[str] = None


class PostResponse(BaseModel):
    id: int
    uid: str
    channel_id: int
    user_id: int
    title: str
    content: Optional[str] = None
    type: str = "text"
    file_url: Optional[str] = None
    is_pinned: bool = False
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class CommentCreate(BaseModel):
    content: str


class CommentResponse(BaseModel):
    id: int
    uid: str
    post_id: int
    user_id: int
    content: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class CommunityResponse(BaseModel):
    id: int
    uid: str
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None
    member_count: int = 0
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ChannelResponse(BaseModel):
    id: int
    uid: str
    community_id: int
    name: str
    description: Optional[str] = None
    type: str = "text"
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class VirtualLabResponse(BaseModel):
    id: int
    uid: str
    subject_id: int
    title: str
    description: Optional[str] = None
    icon: Optional[str] = None
    is_active: bool = True
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ExperimentResponse(BaseModel):
    id: int
    uid: str
    lab_id: int
    title: str
    description: Optional[str] = None
    instructions: Optional[str] = None
    simulation_url: Optional[str] = None
    difficulty: Optional[str] = None
    duration_minutes: int = 0
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ExperimentCreate(BaseModel):
    title: str
    description: Optional[str] = None
    instructions: Optional[str] = None
    diagram_url: Optional[str] = None
    simulation_url: Optional[str] = None
    difficulty: Optional[str] = None
    duration_minutes: int = 0


class ProductResponse(BaseModel):
    id: int
    uid: str
    category_id: Optional[int] = None
    name: str
    description: Optional[str] = None
    price: float
    discount_price: Optional[float] = None
    image_url: Optional[str] = None
    stock: int = 0
    is_featured: bool = False
    rating: float = 0.0
    review_count: int = 0
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class CategoryResponse(BaseModel):
    id: int
    uid: str
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class CartResponse(BaseModel):
    id: int
    uid: str
    user_id: int
    items: List[Any] = []
    total: float = 0.0
    coupon_code: Optional[str] = None
    discount_amount: float = 0.0

    class Config:
        from_attributes = True


class CartItemAdd(BaseModel):
    product_id: int
    quantity: int = 1


class CartItemUpdate(BaseModel):
    quantity: int


class CouponApply(BaseModel):
    coupon_code: str


class OrderCreate(BaseModel):
    shipping_address: str


class OrderResponse(BaseModel):
    id: int
    uid: str
    user_id: int
    total_amount: float
    discount_amount: float = 0.0
    final_amount: float
    status: str = "pending"
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ScholarshipResponse(BaseModel):
    id: int
    uid: str
    title: str
    description: Optional[str] = None
    organization: Optional[str] = None
    amount: Optional[float] = None
    eligibility: Optional[str] = None
    deadline: Optional[datetime] = None
    application_url: Optional[str] = None
    is_active: bool = True
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class AIChatMessage(BaseModel):
    message: str
    session_id: Optional[str] = None


class AIChatResponse(BaseModel):
    response: str
    session_id: str


class AISessionResponse(BaseModel):
    id: str
    title: str
    created_at: Optional[datetime] = None


class TeacherResponse(BaseModel):
    id: int
    uid: str
    user_id: int
    qualification: Optional[str] = None
    experience_years: int = 0
    subjects: Optional[Any] = None
    bio: Optional[str] = None
    is_available: bool = True
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class AchievementResponse(BaseModel):
    id: int
    uid: str
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None
    xp_reward: int = 0
    coin_reward: int = 0
    category: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class BadgeResponse(BaseModel):
    id: int
    uid: str
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None
    tier: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class RewardResponse(BaseModel):
    id: int
    uid: str
    type: str
    amount: int = 0
    description: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class XPAward(BaseModel):
    amount: int
    reason: str
    reference_type: Optional[str] = None
    reference_id: Optional[int] = None


class CoinAward(BaseModel):
    amount: int
    reason: str
    reference_type: Optional[str] = None
    reference_id: Optional[int] = None


class ProfileResponse(BaseModel):
    id: int
    uid: str
    full_name: str
    email: str
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    role: str
    class_name: Optional[str] = None
    stream: Optional[str] = None
    school: Optional[str] = None
    coins: int = 0
    xp: int = 0
    level: int = 1
    achievements: List[Any] = []
    certificates: List[Any] = []

    class Config:
        from_attributes = True


class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    date_of_birth: Optional[datetime] = None
    gender: Optional[str] = None
    school: Optional[str] = None
    board: Optional[str] = None
    class_name: Optional[str] = None
    section: Optional[str] = None
    stream: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    village_town: Optional[str] = None
    pincode: Optional[str] = None
    parent_name: Optional[str] = None
    parent_phone: Optional[str] = None
    parent_email: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None


class AvatarUpdate(BaseModel):
    avatar_url: Optional[str] = None
    avatar_base64: Optional[str] = None


class SettingsUpdate(BaseModel):
    language_preference: Optional[str] = None
    notification_preferences: Optional[dict] = None
    privacy_settings: Optional[dict] = None


class PasswordChange(BaseModel):
    old_password: str
    new_password: str


class CertificateResponse(BaseModel):
    id: int
    uid: str
    user_id: int
    title: str
    description: Optional[str] = None
    issued_at: Optional[datetime] = None
    certificate_url: Optional[str] = None

    class Config:
        from_attributes = True


class CertificateGenerate(BaseModel):
    course_id: Optional[int] = None
    exam_id: Optional[int] = None
    certificate_type: str


class LeaderboardEntry(BaseModel):
    rank: int
    user_id: int
    full_name: str
    avatar_url: Optional[str] = None
    score: int = 0
    level: int = 1


class BookmarkCreate(BaseModel):
    resource_id: Optional[int] = None
    video_id: Optional[int] = None


class BookmarkResponse(BaseModel):
    id: int
    uid: str
    user_id: int
    resource_id: Optional[int] = None
    video_id: Optional[int] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class FavoriteCreate(BaseModel):
    item_type: str
    item_id: int


class FavoriteResponse(BaseModel):
    id: int
    uid: str
    user_id: int
    item_type: str
    item_id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class SearchResults(BaseModel):
    resources: List[Any] = []
    videos: List[Any] = []
    subjects: List[Any] = []
    teachers: List[Any] = []
    products: List[Any] = []
    total: int = 0


class DownloadResponse(BaseModel):
    id: int
    uid: str
    resource_id: int
    downloaded_at: Optional[datetime] = None
    resource: Optional[Any] = None

    class Config:
        from_attributes = True


class InboxMessageCreate(BaseModel):
    receiver_id: int
    subject: Optional[str] = None
    content: str
    is_draft: bool = False


class InboxMessageResponse(BaseModel):
    id: int
    uid: str
    sender_id: int
    receiver_id: int
    content: str
    subject: Optional[str] = None
    is_read: bool = False
    is_starred: bool = False
    is_important: bool = False
    is_draft: bool = False
    is_trashed: bool = False
    folder: str = "inbox"
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class FeedPostCreate(BaseModel):
    content: str
    post_type: str = "text"
    file_url: Optional[str] = None


class FeedPostResponse(BaseModel):
    id: int
    uid: str
    user_id: int
    content: str
    post_type: str = "text"
    file_url: Optional[str] = None
    likes_count: int = 0
    comments_count: int = 0
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ConversationResponse(BaseModel):
    conversation_id: str
    other_user: Optional[UserResponse] = None
    last_message: Optional[MessageResponseModel] = None
    unread_count: int = 0


class AnalyticsOverview(BaseModel):
    study_hours: float = 0.0
    subjects_covered: int = 0
    quizzes_taken: int = 0
    average_score: float = 0.0
    total_xp: int = 0
    current_level: int = 1


class StudyHoursResponse(BaseModel):
    date: str
    hours: float


class SubjectPerformance(BaseModel):
    subject_id: int
    subject_name: str
    average_score: float
    quizzes_taken: int
    time_spent: float


class HeatmapData(BaseModel):
    date: str
    intensity: int


class WeeklyProgress(BaseModel):
    day: str
    hours: float
    tasks_completed: int


class GamificationData(BaseModel):
    coins: int = 0
    xp: int = 0
    level: int = 1
    badges: List[Any] = []
    achievements: List[Any] = []
    rewards: List[Any] = []


class DashboardData(BaseModel):
    continue_learning: List[Any] = []
    recent_resources: List[Any] = []
    upcoming_exams: List[Any] = []
    upcoming_classes: List[Any] = []
    notifications: List[Any] = []
    coins: int = 0
    xp: int = 0
    rank: int = 0
    daily_goals: dict = {}
    weekly_progress: List[Any] = []
    calendar_events: List[Any] = []
