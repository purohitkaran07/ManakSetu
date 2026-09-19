import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, JSON, DateTime
from app.database import Base


class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    original_requirement = Column(Text, nullable=False)
    structured_requirement = Column(JSON, nullable=False)
    recommendations = Column(JSON, nullable=False)
    version_alerts = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
