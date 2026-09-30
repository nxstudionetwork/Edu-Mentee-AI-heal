from app.repositories.base import BaseRepository
from app.repositories.user_repository import UserRepository, TeacherRepository, StudentRepository
from app.repositories.content_repository import SubjectRepository, LessonRepository, TopicRepository, ResourceRepository, VideoRepository
from app.repositories.community_repository import CommunityRepository, ChannelRepository, PostRepository, CommentRepository, MessageRepository, NotificationRepository
from app.repositories.quiz_repository import QuizRepository, QuestionRepository, QuizAttemptRepository
from app.repositories.exam_repository import ExamRepository, ExamRegistrationRepository, ExamResultRepository
from app.repositories.assignment_repository import AssignmentRepository, SubmissionRepository
from app.repositories.event_repository import EventRepository
from app.repositories.virtual_lab_repository import VirtualLabRepository, ExperimentRepository
from app.repositories.marketplace_repository import CategoryRepository, ProductRepository, CartRepository, CartItemRepository, OrderRepository, WishlistRepository, CouponRepository
from app.repositories.gamification_repository import AchievementRepository, BadgeRepository, UserBadgeRepository, LeaderboardRepository, RewardRepository
from app.repositories.analytics_repository import AnalyticsRepository, AuditLogRepository
from app.repositories.learning_path_repository import LearningPathRepository, LearningPathStepRepository, UserLearningPathRepository

__all__ = [
    "BaseRepository",
    "UserRepository", "TeacherRepository", "StudentRepository",
    "SubjectRepository", "LessonRepository", "TopicRepository", "ResourceRepository", "VideoRepository",
    "CommunityRepository", "ChannelRepository", "PostRepository", "CommentRepository", "MessageRepository", "NotificationRepository",
    "QuizRepository", "QuestionRepository", "QuizAttemptRepository",
    "ExamRepository", "ExamRegistrationRepository", "ExamResultRepository",
    "AssignmentRepository", "SubmissionRepository",
    "EventRepository",
    "VirtualLabRepository", "ExperimentRepository",
    "CategoryRepository", "ProductRepository", "CartRepository", "CartItemRepository", "OrderRepository", "WishlistRepository", "CouponRepository",
    "AchievementRepository", "BadgeRepository", "UserBadgeRepository", "LeaderboardRepository", "RewardRepository",
    "AnalyticsRepository", "AuditLogRepository",
    "LearningPathRepository", "LearningPathStepRepository", "UserLearningPathRepository",
]
