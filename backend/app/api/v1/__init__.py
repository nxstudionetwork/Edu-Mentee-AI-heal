from fastapi import APIRouter
from app.api.v1.auth import router as auth_router
from app.api.v1.users import router as users_router
from app.api.v1.dashboard import router as dashboard_router
from app.api.v1.subjects import router as subjects_router
from app.api.v1.lessons import router as lessons_router
from app.api.v1.contents import router as contents_router
from app.api.v1.resources import router as resources_router
from app.api.v1.videos import router as videos_router
from app.api.v1.downloads import router as downloads_router
from app.api.v1.quizzes import router as quizzes_router
from app.api.v1.exams import router as exams_router
from app.api.v1.assignments import router as assignments_router
from app.api.v1.calendar import router as calendar_router
from app.api.v1.notifications import router as notifications_router
from app.api.v1.inbox import router as inbox_router
from app.api.v1.virtual_labs import router as virtual_labs_router
from app.api.v1.marketplace import router as marketplace_router
from app.api.v1.cart import router as cart_router
from app.api.v1.orders import router as orders_router
from app.api.v1.scholarships import router as scholarships_router
from app.api.v1.community import router as community_router
from app.api.v1.feed import router as feed_router
from app.api.v1.messages import router as messages_router
from app.api.v1.ai_helper import router as ai_helper_router
from app.api.v1.ask_teacher import router as ask_teacher_router
from app.api.v1.analytics import router as analytics_router
from app.api.v1.gamification import router as gamification_router
from app.api.v1.profile import router as profile_router
from app.api.v1.settings import router as settings_router
from app.api.v1.certificates import router as certificates_router
from app.api.v1.leaderboard import router as leaderboard_router
from app.api.v1.bookmarks import router as bookmarks_router
from app.api.v1.favorites import router as favorites_router
from app.api.v1.search import router as search_router
from app.api.v1.learning_paths import router as learning_paths_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(users_router)
api_router.include_router(dashboard_router)
api_router.include_router(subjects_router)
api_router.include_router(lessons_router)
api_router.include_router(contents_router)
api_router.include_router(resources_router)
api_router.include_router(videos_router)
api_router.include_router(downloads_router)
api_router.include_router(quizzes_router)
api_router.include_router(exams_router)
api_router.include_router(assignments_router)
api_router.include_router(calendar_router)
api_router.include_router(notifications_router)
api_router.include_router(inbox_router)
api_router.include_router(virtual_labs_router)
api_router.include_router(marketplace_router)
api_router.include_router(cart_router)
api_router.include_router(orders_router)
api_router.include_router(scholarships_router)
api_router.include_router(community_router)
api_router.include_router(feed_router)
api_router.include_router(messages_router)
api_router.include_router(ai_helper_router)
api_router.include_router(ask_teacher_router)
api_router.include_router(analytics_router)
api_router.include_router(gamification_router)
api_router.include_router(profile_router)
api_router.include_router(settings_router)
api_router.include_router(certificates_router)
api_router.include_router(leaderboard_router)
api_router.include_router(bookmarks_router)
api_router.include_router(favorites_router)
api_router.include_router(search_router)
api_router.include_router(learning_paths_router)
