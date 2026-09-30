from fastapi import APIRouter, Depends, HTTPException, Query, Path, Body, status
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime, timedelta
import hashlib

from app.database import get_db
from app.dependencies import get_current_user, get_current_teacher, create_access_token, decode_token
from app.core.exceptions import NotFoundException, BadRequestException, ConflictException
from app.models import User, Student, UserRole
from app.schemas import (
    UserCreate, UserLogin, UserUpdate, UserResponse, TokenResponse,
    PasswordReset, MessageResponse,
)
from app.utils.id_generator import generate_id
from app.config import get_settings

settings = get_settings()

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])


def _hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def _verify_password(plain_password: str, hashed_password: str) -> bool:
    return _hash_password(plain_password) == hashed_password


def _user_to_response(user: User) -> dict:
    return UserResponse(
        id=user.id,
        uid=user.uid,
        full_name=user.full_name,
        email=user.email,
        phone=user.phone,
        avatar_url=user.avatar_url,
        role=user.role.value if hasattr(user.role, 'value') else user.role,
        class_name=user.class_name,
        stream=user.stream,
        coins=user.coins,
        xp=user.xp,
        level=user.level,
        is_active=user.is_active,
        created_at=user.created_at,
    ).model_dump() | {
        "school": user.school,
        "board": user.board,
        "section": user.section,
        "date_of_birth": user.date_of_birth.isoformat() if user.date_of_birth else None,
        "gender": user.gender.value if hasattr(user.gender, 'value') else user.gender,
        "country": getattr(user, "country", None),
        "state": user.state,
        "district": getattr(user, "district", None),
        "village_town": getattr(user, "village_town", None),
        "city": user.city,
        "pincode": user.pincode,
        "parent_name": user.parent_name,
        "parent_phone": user.parent_phone,
    }


@router.post("/register")
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user with full personal and academic details."""
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        raise ConflictException(detail="Email already registered")

    login_id = (user_data.login_id or "").strip() or user_data.email

    existing_username = db.query(User).filter(User.login_id == login_id).first()
    if existing_username:
        raise ConflictException(detail="Username already taken")

    hashed_password = _hash_password(user_data.password)
    uid = generate_id("USR")

    new_user = User(
        uid=uid,
        login_id=login_id,
        email=user_data.email,
        full_name=user_data.full_name,
        hashed_password=hashed_password,
        phone=user_data.phone,
        role=UserRole.student,
        school=user_data.school,
        board=user_data.board,
        class_name=user_data.class_name,
        stream=user_data.stream,
        date_of_birth=user_data.date_of_birth,
        gender=user_data.gender,
        state=user_data.state,
        district=user_data.district,
        village_town=user_data.village_town,
        city=user_data.city,
        pincode=user_data.pincode,
        is_active=True,
        is_verified=True,
    )
    db.add(new_user)
    db.flush()

    student = Student(uid=generate_id("STU"), user_id=new_user.id)
    db.add(student)
    db.commit()
    db.refresh(new_user)

    token = create_access_token(data={"sub": str(new_user.id), "user_id": new_user.id})

    return {
        "status": "success",
        "message": "User registered successfully",
        "data": {
            "access_token": token,
            "token_type": "bearer",
            "user": _user_to_response(new_user),
        },
    }


@router.post("/login")
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """Login with email/student_id + password. Returns JWT token and user data."""
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user:
        user = db.query(User).filter(User.login_id == credentials.email).first()
    if not user:
        raise BadRequestException(detail="Invalid credentials")

    if not _verify_password(credentials.password, user.hashed_password):
        raise BadRequestException(detail="Invalid credentials")

    if not user.is_active:
        raise BadRequestException(detail="Account is deactivated")

    user.last_login = datetime.utcnow()
    db.commit()
    db.refresh(user)

    token = create_access_token(data={"sub": str(user.id), "user_id": user.id})

    return {
        "status": "success",
        "message": "Login successful",
        "data": {
            "access_token": token,
            "token_type": "bearer",
            "user": _user_to_response(user),
        },
    }


@router.post("/forgot-password")
def forgot_password(email: str = Body(..., embed=True), db: Session = Depends(get_db)):
    """Accept email and return success message for password reset."""
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return {
            "status": "success",
            "message": "If the email exists, a password reset link has been sent",
            "data": None,
        }
    return {
        "status": "success",
        "message": "If the email exists, a password reset link has been sent",
        "data": None,
    }


@router.post("/reset-password")
def reset_password(payload: PasswordReset, db: Session = Depends(get_db)):
    """Accept token + new password, update password."""
    try:
        data = decode_token(payload.token)
        user_id = data.get("sub") or data.get("user_id")
        user = db.query(User).filter(User.id == int(user_id)).first()
    except Exception:
        raise BadRequestException(detail="Invalid or expired reset token")

    if not user:
        raise NotFoundException(detail="User not found")

    user.hashed_password = _hash_password(payload.new_password)
    db.commit()

    return {
        "status": "success",
        "message": "Password reset successfully",
        "data": None,
    }


@router.post("/verify-email")
def verify_email(token: str = Body(..., embed=True), db: Session = Depends(get_db)):
    """Accept verification token and verify user email (mock implementation)."""
    try:
        data = decode_token(token)
        user_id = data.get("sub") or data.get("user_id")
        user = db.query(User).filter(User.id == int(user_id)).first()
    except Exception:
        raise BadRequestException(detail="Invalid or expired verification token")

    if not user:
        raise NotFoundException(detail="User not found")

    user.is_verified = True
    db.commit()

    return {
        "status": "success",
        "message": "Email verified successfully",
        "data": None,
    }


@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    """Get current authenticated user profile."""
    return {
        "status": "success",
        "message": "User profile retrieved",
        "data": _user_to_response(current_user),
    }


@router.put("/me")
def update_me(
    user_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update current user profile."""
    update_dict = user_data.model_dump(exclude_unset=True)
    for field, value in update_dict.items():
        setattr(current_user, field, value)
    current_user.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(current_user)

    return {
        "status": "success",
        "message": "Profile updated successfully",
        "data": _user_to_response(current_user),
    }


@router.post("/refresh")
def refresh_token(current_user: User = Depends(get_current_user)):
    """Refresh JWT token."""
    token = create_access_token(data={"sub": str(current_user.id), "user_id": current_user.id})

    return {
        "status": "success",
        "message": "Token refreshed successfully",
        "data": {
            "access_token": token,
            "token_type": "bearer",
        },
    }
