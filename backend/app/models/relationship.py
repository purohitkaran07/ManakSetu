from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class StandardRelationship(Base):
    __tablename__ = "standard_relationships"

    id = Column(Integer, primary_key=True, index=True)
    source_standard_id = Column(Integer, ForeignKey("standards.id", ondelete="CASCADE"), nullable=False, index=True)
    target_standard_id = Column(Integer, ForeignKey("standards.id", ondelete="CASCADE"), nullable=False, index=True)
    relationship_type = Column(String(50), nullable=False, index=True)
    # Supported relationship types:
    # REFERENCES, REFERRED_BY, SUPERSEDES, AMENDED_BY, RELATED_TO

    source_standard = relationship(
        "Standard",
        foreign_keys=[source_standard_id],
        back_populates="outgoing_relationships",
    )
    target_standard = relationship(
        "Standard",
        foreign_keys=[target_standard_id],
        back_populates="incoming_relationships",
    )
