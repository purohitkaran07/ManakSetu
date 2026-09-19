from sqlalchemy import Column, Integer, String, Text, JSON
from sqlalchemy.orm import relationship
from app.database import Base


class Standard(Base):
    __tablename__ = "standards"

    id = Column(Integer, primary_key=True, index=True)
    standard_number = Column(String(100), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False, index=True)
    scope = Column(Text, nullable=False)
    standard_type = Column(String(100), nullable=False)  # e.g., "Product Specification", "Safety Standard"
    classification = Column(String(100), nullable=False)  # e.g., "Electrical & Electronics"
    certification_status = Column(String(100), nullable=False)  # exact source value, e.g., "Voluntary"
    status = Column(String(50), nullable=False, default="Active")  # "Active", "Superseded", "Withdrawn"
    year = Column(Integer, nullable=False)
    description = Column(Text, nullable=True)
    source_reference = Column(String(255), nullable=True)  # Documented authoritative reference source
    meta_info = Column(JSON, nullable=True)  # additional structured metadata

    # Outgoing relationships (this standard references other standards)
    outgoing_relationships = relationship(
        "StandardRelationship",
        foreign_keys="StandardRelationship.source_standard_id",
        back_populates="source_standard",
        cascade="all, delete-orphan",
    )

    # Incoming relationships (other standards referencing this standard)
    incoming_relationships = relationship(
        "StandardRelationship",
        foreign_keys="StandardRelationship.target_standard_id",
        back_populates="target_standard",
        cascade="all, delete-orphan",
    )
