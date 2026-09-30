from pydantic import BaseModel
from typing import Optional, List


class SearchResult(BaseModel):
    id: int
    uid: str
    title: str
    description: Optional[str] = None
    type: str
    url: Optional[str] = None
    image_url: Optional[str] = None
    relevance_score: float = 0.0


class SearchResponse(BaseModel):
    query: str
    results: List[SearchResult] = []
    total: int = 0
    page: int = 1
    size: int = 10
