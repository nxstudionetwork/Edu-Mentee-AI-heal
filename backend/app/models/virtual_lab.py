from datetime import datetime

from sqlalchemy import (
    Column, Integer, String, Text, Boolean, DateTime, ForeignKey,
)
from sqlalchemy.orm import relationship

from app.database import Base
from app.utils.id_generator import generate_id


class VirtualLab(Base):
    __tablename__ = "virtual_labs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    uid = Column(String(20), unique=True, nullable=False, default=lambda: generate_id("LAB"))
    subject_id = Column(Integer, ForeignKey("subjects.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(300), nullable=False)
    description = Column(Text, nullable=True)
    icon = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    subject = relationship("Subject", back_populates="virtual_labs")
    experiments = relationship("Experiment", back_populates="lab", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<VirtualLab(id={self.id}, uid='{self.uid}', title='{self.title}')>"


class Experiment(Base):
    __tablename__ = "experiments"

    id = Column(Integer, primary_key=True, autoincrement=True)
    uid = Column(String(20), unique=True, nullable=False, default=lambda: generate_id("EXPT"))
    lab_id = Column(Integer, ForeignKey("virtual_labs.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(300), nullable=False)
    description = Column(Text, nullable=True)
    instructions = Column(Text, nullable=True)
    diagram_url = Column(String(500), nullable=True)
    simulation_url = Column(String(500), nullable=True)
    difficulty = Column(String(20), nullable=True)
    duration_minutes = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    lab = relationship("VirtualLab", back_populates="experiments")

    def __repr__(self):
        return f"<Experiment(id={self.id}, uid='{self.uid}', title='{self.title}')>"
