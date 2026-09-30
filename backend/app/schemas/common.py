from pydantic import BaseModel
from typing import Optional


class APIResponse(BaseModel):
    status: str = "success"
    message: str = ""
    data: Optional[dict] = None
    error: Optional[str] = None


class PaginatedResponse(APIResponse):
    total: int = 0
    page: int = 1
    size: int = 10
    pages: int = 0


class HealthResponse(BaseModel):
    status: str = "ok"
    version: str = "1.0.0"
    uptime: float = 0.0
    database_connected: bool = False


class ErrorResponse(BaseModel):
    status: str = "error"
    message: str = ""
    detail: Optional[str] = None
    error_code: Optional[str] = None
