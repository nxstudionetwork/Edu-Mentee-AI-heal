from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class AchievementBase(BaseModel):
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None
    xp_reward: int = 0
    coins_reward: int = 0


class AchievementResponse(AchievementBase):
    id: int
    uid: str
    is_active: bool = True
    created_at: datetime

    class Config:
        from_attributes = True


class BadgeBase(BaseModel):
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None


class BadgeResponse(BadgeBase):
    id: int
    uid: str
    is_active: bool = True
    created_at: datetime

    class Config:
        from_attributes = True


class UserBadgeResponse(BaseModel):
    id: int
    badge: BadgeResponse
    earned_at: datetime

    class Config:
        from_attributes = True


class RewardResponse(BaseModel):
    id: int
    uid: str
    type: str
    amount: int = 0
    description: Optional[str] = None
    reference_type: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class LeaderboardEntry(BaseModel):
    rank: int
    user_id: int
    user_name: str
    avatar_url: Optional[str] = None
    xp: int = 0
    coins: int = 0
    level: int = 1


class LeaderboardResponse(BaseModel):
    category: str
    entries: List[LeaderboardEntry] = []


class GamificationResponse(BaseModel):
    coins: int = 0
    xp: int = 0
    level: int = 1
    current_level_xp: int = 0
    next_level_xp: int = 0
    achievements: List[AchievementResponse] = []
    badges: List[UserBadgeResponse] = []
    rank: int = 0
