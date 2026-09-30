from datetime import datetime

from sqlalchemy import (
    Column, Integer, String, Text, Boolean, DateTime, Float, ForeignKey,
)
from sqlalchemy.orm import relationship

from app.database import Base
from app.utils.id_generator import generate_id


class Scholarship(Base):
    __tablename__ = "scholarships"

    id = Column(Integer, primary_key=True, autoincrement=True)
    uid = Column(String(20), unique=True, nullable=False, default=lambda: generate_id("SCHL"))
    title = Column(String(300), nullable=False)
    description = Column(Text, nullable=True)
    organization = Column(String(300), nullable=True)
    amount = Column(Float, nullable=True)
    eligibility = Column(Text, nullable=True)
    deadline = Column(DateTime, nullable=True)
    application_url = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f"<Scholarship(id={self.id}, uid='{self.uid}', title='{self.title}')>"
