from fastapi import APIRouter, Depends, Path, Body
from sqlalchemy.orm import Session
from datetime import datetime

from app.database import get_db
from app.dependencies import get_current_user
from app.core.exceptions import NotFoundException, BadRequestException
from app.models import User, Achievement, Badge, UserBadge, Reward, Leaderboard
from app.schemas import AchievementResponse, BadgeResponse, RewardResponse
from app.utils.id_generator import generate_id

router = APIRouter(prefix="/api/v1/gamification", tags=["Gamification"])


@router.get("/")
def get_gamification_data(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get user's gamification data: coins, xp, level, badges, achievements."""
    user_badges = db.query(UserBadge).filter(UserBadge.user_id == current_user.id).all()
    badge_ids = [ub.badge_id for ub in user_badges if ub.badge_id]
    badges = db.query(Badge).filter(Badge.id.in_(badge_ids)).all() if badge_ids else []

    achievement_ids = [ub.achievement_id for ub in user_badges if ub.achievement_id]
    achievements = db.query(Achievement).filter(Achievement.id.in_(achievement_ids)).all() if achievement_ids else []

    rewards = db.query(Reward).filter(Reward.user_id == current_user.id).order_by(Reward.created_at.desc()).limit(10).all()

    return {
        "status": "success",
        "message": "Gamification data retrieved",
        "data": {
            "coins": current_user.coins,
            "xp": current_user.xp,
            "level": current_user.level,
            "badges": [
                {
                    "id": b.id,
                    "uid": b.uid,
                    "name": b.name,
                    "description": b.description,
                    "icon": b.icon,
                    "tier": b.tier,
                }
                for b in badges
            ],
            "achievements": [
                {
                    "id": a.id,
                    "uid": a.uid,
                    "name": a.name,
                    "description": a.description,
                    "icon": a.icon,
                    "xp_reward": a.xp_reward,
                    "coin_reward": a.coin_reward,
                }
                for a in achievements
            ],
            "recent_rewards": [
                {
                    "id": r.id,
                    "uid": r.uid,
                    "type": r.type,
                    "amount": r.amount,
                    "description": r.description,
                    "created_at": r.created_at.isoformat() if r.created_at else None,
                }
                for r in rewards
            ],
        },
    }


@router.get("/achievements")
def list_achievements(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all achievements."""
    achievements = db.query(Achievement).filter(Achievement.is_active == True).all()

    user_badges = db.query(UserBadge).filter(UserBadge.user_id == current_user.id).all()
    earned_ids = {ub.achievement_id for ub in user_badges if ub.achievement_id}

    return {
        "status": "success",
        "message": "Achievements retrieved",
        "data": [
            {
                "id": a.id,
                "uid": a.uid,
                "name": a.name,
                "description": a.description,
                "icon": a.icon,
                "xp_reward": a.xp_reward,
                "coin_reward": a.coin_reward,
                "category": a.category,
                "is_earned": a.id in earned_ids,
            }
            for a in achievements
        ],
    }


@router.get("/badges")
def list_badges(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all badges."""
    badges = db.query(Badge).filter(Badge.is_active == True).all()

    user_badges = db.query(UserBadge).filter(UserBadge.user_id == current_user.id).all()
    earned_ids = {ub.badge_id for ub in user_badges if ub.badge_id}

    return {
        "status": "success",
        "message": "Badges retrieved",
        "data": [
            {
                "id": b.id,
                "uid": b.uid,
                "name": b.name,
                "description": b.description,
                "icon": b.icon,
                "tier": b.tier,
                "is_earned": b.id in earned_ids,
            }
            for b in badges
        ],
    }


@router.get("/rewards")
def get_rewards(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get user's reward history."""
    rewards = db.query(Reward).filter(
        Reward.user_id == current_user.id,
    ).order_by(Reward.created_at.desc()).limit(50).all()

    return {
        "status": "success",
        "message": "Rewards retrieved",
        "data": [
            {
                "id": r.id,
                "uid": r.uid,
                "type": r.type,
                "amount": r.amount,
                "description": r.description,
                "reference_type": r.reference_type,
                "reference_id": r.reference_id,
                "created_at": r.created_at.isoformat() if r.created_at else None,
            }
            for r in rewards
        ],
    }


@router.post("/xp")
def award_xp(
    amount: int = Body(..., embed=True),
    reason: str = Body(..., embed=True),
    reference_type: str = Body(None, embed=True),
    reference_id: int = Body(None, embed=True),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Award XP to user."""
    if amount <= 0:
        raise BadRequestException(detail="Amount must be positive")

    current_user.xp += amount
    reward = Reward(
        uid=generate_id("RWRD"),
        user_id=current_user.id,
        type="xp",
        amount=amount,
        description=reason,
        reference_type=reference_type,
        reference_id=reference_id,
    )
    db.add(reward)

    new_level = (current_user.xp // 1000) + 1
    if new_level > current_user.level:
        current_user.level = new_level

    db.commit()

    return {
        "status": "success",
        "message": f"Awarded {amount} XP",
        "data": {
            "xp": current_user.xp,
            "level": current_user.level,
            "xp_earned": amount,
        },
    }


@router.post("/coins")
def award_coins(
    amount: int = Body(..., embed=True),
    reason: str = Body(..., embed=True),
    reference_type: str = Body(None, embed=True),
    reference_id: int = Body(None, embed=True),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Award coins to user."""
    if amount <= 0:
        raise BadRequestException(detail="Amount must be positive")

    current_user.coins += amount
    reward = Reward(
        uid=generate_id("RWRD"),
        user_id=current_user.id,
        type="coin",
        amount=amount,
        description=reason,
        reference_type=reference_type,
        reference_id=reference_id,
    )
    db.add(reward)
    db.commit()

    return {
        "status": "success",
        "message": f"Awarded {amount} coins",
        "data": {
            "coins": current_user.coins,
            "coins_earned": amount,
        },
    }
