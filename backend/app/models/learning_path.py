from datetime import datetime

from sqlalchemy import (
    Column, Integer, String, Text, Boolean, DateTime, Float, ForeignKey,
)
from sqlalchemy.orm import relationship

from app.database import Base
from app.utils.id_generator import generate_id


class LearningPath(Base):
    __tablename__ = "learning_paths"

    id = Column(Integer, primary_key=True, autoincrement=True)
    uid = Column(String(20), unique=True, nullable=False, default=lambda: generate_id("LP"))
    title = Column(String(300), nullable=False)
    description = Column(Text, nullable=True)
    subject_id = Column(Integer, ForeignKey("subjects.id", ondelete="CASCADE"), nullable=True)
    grade_level = Column(String(20), nullable=True)
    difficulty = Column(String(20), nullable=True)
    estimated_duration_days = Column(Integer, nullable=True)
    total_steps = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    subject = relationship("Subject", backref="learning_paths")
    steps = relationship("LearningPathStep", back_populates="learning_path", cascade="all, delete-orphan", order_by="LearningPathStep.step_order")
    user_enrollments = relationship("UserLearningPath", back_populates="learning_path", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<LearningPath(id={self.id}, uid='{self.uid}', title='{self.title}')>"


class LearningPathStep(Base):
    __tablename__ = "learning_path_steps"

    id = Column(Integer, primary_key=True, autoincrement=True)
    uid = Column(String(20), unique=True, nullable=False, default=lambda: generate_id("LPS"))
    learning_path_id = Column(Integer, ForeignKey("learning_paths.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(300), nullable=False)
    description = Column(Text, nullable=True)
    step_order = Column(Integer, default=0, nullable=False)
    content_type = Column(String(30), nullable=True)
    content_id = Column(String(100), nullable=True)
    estimated_minutes = Column(Integer, default=0, nullable=False)
    is_optional = Column(Boolean, default=False, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    learning_path = relationship("LearningPath", back_populates="steps")

    def __repr__(self):
        return f"<LearningPathStep(id={self.id}, uid='{self.uid}', title='{self.title}')>"


class UserLearningPath(Base):
    __tablename__ = "user_learning_paths"

    id = Column(Integer, primary_key=True, autoincrement=True)
    uid = Column(String(20), unique=True, nullable=False, default=lambda: generate_id("ULP"))
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    learning_path_id = Column(Integer, ForeignKey("learning_paths.id", ondelete="CASCADE"), nullable=False)
    current_step = Column(Integer, default=0, nullable=False)
    is_completed = Column(Boolean, default=False, nullable=False)
    started_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", backref="learning_path_enrollments")
    learning_path = relationship("LearningPath", back_populates="user_enrollments")

    def __repr__(self):
        return f"<UserLearningPath(id={self.id}, uid='{self.uid}', user_id={self.user_id}, path_id={self.learning_path_id})>"
