import math
from datetime import datetime

from sqlalchemy.orm import Session

from app.models.user import User
from app.models.gamification import Reward, Achievement, UserBadge, Leaderboard


class GamificationService:

    @staticmethod
    def get_level(xp: int) -> int:
        if xp < 0:
            return 1
        return int(math.sqrt(xp / 100)) + 1

    @staticmethod
    def get_level_progress(xp: int) -> dict:
        level = GamificationService.get_level(xp)
        current_level_min = (level - 1) ** 2 * 100
        next_level_min = level ** 2 * 100
        xp_in_level = xp - current_level_min
        xp_needed = next_level_min - current_level_min

        return {
            "level": level,
            "current_level_xp": xp_in_level,
            "next_level_xp": xp_needed,
        }

    @staticmethod
    def award_xp(db: Session, user_id: int, amount: int, description: str = "") -> dict:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise ValueError("User not found")

        old_level = GamificationService.get_level(user.xp)
        user.xp += amount
        new_level = GamificationService.get_level(user.xp)
        user.level = new_level

        reward = Reward(
            user_id=user_id,
            type="xp",
            amount=amount,
            description=description,
            reference_type="xp_award",
        )
        db.add(reward)
        db.commit()
        db.refresh(user)

        return {
            "user": user,
            "amount": amount,
            "level_up": new_level > old_level,
            "new_level": new_level,
        }

    @staticmethod
    def award_coins(db: Session, user_id: int, amount: int, description: str = "") -> dict:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise ValueError("User not found")

        user.coins += amount

        reward = Reward(
            user_id=user_id,
            type="coins",
            amount=amount,
            description=description,
            reference_type="coin_award",
        )
        db.add(reward)
        db.commit()
        db.refresh(user)

        return {
            "user": user,
            "amount": amount,
            "total_coins": user.coins,
        }

    @staticmethod
    def check_achievements(db: Session, user_id: int) -> list:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise ValueError("User not found")

        earned = []
        all_achievements = db.query(Achievement).filter(Achievement.is_active == True).all()
        existing_badge_ids = [
            ub.badge_id for ub in db.query(UserBadge).filter(UserBadge.user_id == user_id).all()
        ]

        for achievement in all_achievements:
            if achievement.id in existing_badge_ids:
                continue

            qualifies = False

            if achievement.xp_reward > 0 and user.xp >= achievement.xp_reward:
                qualifies = True
            if achievement.coins_reward > 0 and user.coins >= achievement.coins_reward:
                qualifies = True
            if user.level >= 5 and achievement.name == "Level 5 reached":
                qualifies = True
            if user.level >= 10 and achievement.name == "Level 10 reached":
                qualifies = True

            if qualifies:
                badge = db.query(UserBadge).filter(
                    UserBadge.user_id == user_id,
                    UserBadge.badge_id == achievement.id,
                ).first()

                if not badge:
                    user_badge = UserBadge(
                        user_id=user_id,
                        badge_id=achievement.id,
                        earned_at=datetime.utcnow(),
                    )
                    db.add(user_badge)
                    earned.append(achievement)

        db.commit()
        return earned
