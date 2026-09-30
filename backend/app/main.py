import time
from contextlib import asynccontextmanager
from datetime import datetime, timezone

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import get_settings
from app.core.exceptions import AppException
from app.core.logging import get_logger
from app.database import Base, engine
from app.api.v1 import (
    auth, users, dashboard, subjects, lessons, contents,
    resources, videos, downloads, quizzes, exams, assignments,
    calendar, notifications, inbox, virtual_labs, marketplace,
    cart, orders, scholarships, community, feed, messages,
    ai_helper, ask_teacher, analytics, gamification, profile,
    settings as settings_router, certificates, leaderboard,
    bookmarks, favorites, search, learning_paths, locations,
)

logger = get_logger(__name__)
settings = get_settings()
start_time = time.time()


@asynccontextmanager
async def lifespan(application: FastAPI):
    logger.info(f"Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    if settings.DEBUG:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created (dev mode)")
    yield
    logger.info("Shutting down")


app = FastAPI(
    title=f"{settings.APP_NAME} API",
    version=settings.APP_VERSION,
    description="Educational Platform Backend API",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration = time.time() - start
    logger.info(
        f"{request.method} {request.url.path} -> {response.status_code} ({duration:.3f}s)"
    )
    return response


@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"status": "error", "message": exc.detail, "error_code": exc.error_code},
    )


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.exception(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"status": "error", "message": "An unexpected error occurred"},
    )


@app.get("/api/v1/health")
async def health_check():
    return {
        "status": "success",
        "data": {
            "name": settings.APP_NAME,
            "version": settings.APP_VERSION,
            "uptime_seconds": int(time.time() - start_time),
            "timestamp": datetime.now(timezone.utc).isoformat(),
        },
    }


app.include_router(auth.router)
app.include_router(users.router)
app.include_router(dashboard.router)
app.include_router(subjects.router)
app.include_router(lessons.router)
app.include_router(contents.router)
app.include_router(resources.router)
app.include_router(videos.router)
app.include_router(downloads.router)
app.include_router(quizzes.router)
app.include_router(exams.router)
app.include_router(assignments.router)
app.include_router(calendar.router)
app.include_router(notifications.router)
app.include_router(inbox.router)
app.include_router(virtual_labs.router)
app.include_router(marketplace.router)
app.include_router(cart.router)
app.include_router(orders.router)
app.include_router(scholarships.router)
app.include_router(community.router)
app.include_router(feed.router)
app.include_router(messages.router)
app.include_router(ai_helper.router)
app.include_router(ask_teacher.router)
app.include_router(analytics.router)
app.include_router(gamification.router)
app.include_router(profile.router)
app.include_router(settings_router.router)
app.include_router(certificates.router)
app.include_router(leaderboard.router)
app.include_router(bookmarks.router)
app.include_router(favorites.router)
app.include_router(search.router)
app.include_router(learning_paths.router)
app.include_router(locations.router)
