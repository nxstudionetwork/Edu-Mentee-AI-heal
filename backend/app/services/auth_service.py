from datetime import datetime, timedelta
from typing import Optional

from sqlalchemy.orm import Session
from passlib.context import CryptContext
import jwt

from app.config import get_settings
from app.models.user import User
from app.utils.id_generator import generate_id

settings = get_settings()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthService:

    @staticmethod
    def hash_password(password: str) -> str:
        return pwd_context.hash(password)

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    def create_access_token(user_id: int, expires_delta: Optional[timedelta] = None) -> str:
        to_encode = {"sub": str(user_id)}
        expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
        to_encode["exp"] = expire
        return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

    @staticmethod
    def register(db: Session, user_data: dict) -> dict:
        existing_user = db.query(User).filter(User.email == user_data.get("email")).first()
        if existing_user:
            raise ValueError("Email already registered")

        existing_login = db.query(User).filter(User.login_id == user_data.get("login_id")).first()
        if existing_login:
            raise ValueError("Login ID already taken")

        hashed_password = AuthService.hash_password(user_data["password"])

        student_id = generate_id("SID") if user_data.get("role", "student") == "student" else None

        user = User(
            login_id=user_data["login_id"],
            student_id=student_id,
            full_name=user_data["full_name"],
            email=user_data["email"],
            hashed_password=hashed_password,
            phone=user_data.get("phone"),
            role=user_data.get("role", "student"),
            class_name=user_data.get("class_name"),
            stream=user_data.get("stream"),
            is_active=True,
            is_verified=False,
            last_login=datetime.utcnow(),
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        token = AuthService.create_access_token(user.id)

        return {"user": user, "token": token}

    @staticmethod
    def login(db: Session, email: str, password: str) -> dict:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            raise ValueError("Invalid email or password")

        if not AuthService.verify_password(password, user.hashed_password):
            raise ValueError("Invalid email or password")

        if not user.is_active:
            raise ValueError("Account is deactivated")

        user.last_login = datetime.utcnow()
        db.commit()
        db.refresh(user)

        token = AuthService.create_access_token(user.id)

        return {"user": user, "token": token}

    @staticmethod
    def verify_token(token: str) -> Optional[int]:
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            user_id = int(payload.get("sub"))
            return user_id
        except (jwt.ExpiredSignatureError, jwt.DecodeError, ValueError, TypeError):
            return None

    @staticmethod
    def change_password(db: Session, user_id: int, old_password: str, new_password: str) -> bool:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise ValueError("User not found")

        if not AuthService.verify_password(old_password, user.hashed_password):
            raise ValueError("Old password is incorrect")

        user.hashed_password = AuthService.hash_password(new_password)
        db.commit()
        return True

    @staticmethod
    def forgot_password(db: Session, email: str) -> str:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            raise ValueError("Email not found")

        reset_token = AuthService.create_access_token(
            user.id, expires_delta=timedelta(hours=1)
        )
        return reset_token

    @staticmethod
    def reset_password(db: Session, token: str, new_password: str) -> bool:
        user_id = AuthService.verify_token(token)
        if not user_id:
            raise ValueError("Invalid or expired token")

        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise ValueError("User not found")

        user.hashed_password = AuthService.hash_password(new_password)
        db.commit()
        return True
