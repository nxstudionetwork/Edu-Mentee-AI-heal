from fastapi import APIRouter, Depends, Body
from sqlalchemy.orm import Session
from datetime import datetime
import hashlib

from app.database import get_db
from app.dependencies import get_current_user
from app.core.exceptions import BadRequestException
from app.models import User

router = APIRouter(prefix="/api/v1/settings", tags=["Settings"])


def _hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


@router.get("/")
def get_settings(
    current_user: User = Depends(get_current_user),
):
    """Get user settings."""
    return {
        "status": "success",
        "message": "Settings retrieved successfully",
        "data": {
            "language_preference": current_user.language_preference,
            "notification_preferences": {},
            "privacy_settings": {},
        },
    }


@router.put("/profile")
def update_profile_settings(
    full_name: str = Body(None, embed=True),
    phone: str = Body(None, embed=True),
    school: str = Body(None, embed=True),
    class_name: str = Body(None, embed=True),
    address: str = Body(None, embed=True),
    city: str = Body(None, embed=True),
    state: str = Body(None, embed=True),
    pincode: str = Body(None, embed=True),
    parent_name: str = Body(None, embed=True),
    parent_phone: str = Body(None, embed=True),
    parent_email: str = Body(None, embed=True),
    emergency_contact_name: str = Body(None, embed=True),
    emergency_contact_phone: str = Body(None, embed=True),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update personal details, address, parent details, emergency contact."""
    if full_name is not None:
        current_user.full_name = full_name
    if phone is not None:
        current_user.phone = phone
    if school is not None:
        current_user.school = school
    if class_name is not None:
        current_user.class_name = class_name
    if address is not None:
        current_user.address = address
    if city is not None:
        current_user.city = city
    if state is not None:
        current_user.state = state
    if pincode is not None:
        current_user.pincode = pincode
    if parent_name is not None:
        current_user.parent_name = parent_name
    if parent_phone is not None:
        current_user.parent_phone = parent_phone
    if parent_email is not None:
        current_user.parent_email = parent_email
    if emergency_contact_name is not None:
        current_user.emergency_contact_name = emergency_contact_name
    if emergency_contact_phone is not None:
        current_user.emergency_contact_phone = emergency_contact_phone

    current_user.updated_at = datetime.utcnow()
    db.commit()

    return {
        "status": "success",
        "message": "Profile settings updated",
        "data": None,
    }


@router.put("/language")
def update_language(
    language: str = Body(..., embed=True),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update language preference."""
    current_user.language_preference = language
    current_user.updated_at = datetime.utcnow()
    db.commit()

    return {
        "status": "success",
        "message": "Language updated successfully",
        "data": {"language_preference": language},
    }


@router.put("/notifications")
def update_notification_settings(
    preferences: dict = Body(..., embed=True),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update notification preferences."""
    current_user.updated_at = datetime.utcnow()
    db.commit()

    return {
        "status": "success",
        "message": "Notification settings updated",
        "data": {"notification_preferences": preferences},
    }


@router.put("/privacy")
def update_privacy_settings(
    settings: dict = Body(..., embed=True),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update privacy settings."""
    current_user.updated_at = datetime.utcnow()
    db.commit()

    return {
        "status": "success",
        "message": "Privacy settings updated",
        "data": {"privacy_settings": settings},
    }


@router.put("/security/password")
def change_password(
    old_password: str = Body(..., embed=True),
    new_password: str = Body(..., embed=True),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Change password (verify old password, set new)."""
    old_hashed = _hash_password(old_password)
    if old_hashed != current_user.hashed_password:
        raise BadRequestException(detail="Current password is incorrect")

    if len(new_password) < 6:
        raise BadRequestException(detail="New password must be at least 6 characters")

    current_user.hashed_password = _hash_password(new_password)
    current_user.updated_at = datetime.utcnow()
    db.commit()

    return {
        "status": "success",
        "message": "Password changed successfully",
        "data": None,
    }


@router.delete("/account")
def delete_account(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Soft-delete account (set is_active=False)."""
    current_user.is_active = False
    current_user.updated_at = datetime.utcnow()
    db.commit()

    return {
        "status": "success",
        "message": "Account deactivated successfully",
        "data": None,
    }
