from typing import List, Optional
from pydantic import BaseModel, Field
from app.schemas.standard import StandardResponse
from app.schemas.requirement import StructuredRequirement


class VersionAlertItem(BaseModel):
    alert_type: str = "NEWER_VERSION"
    explicit_standard: str
    superseding_standard: str
    message: str


class RecommendationItem(BaseModel):
    standard: StandardResponse
    reason: str
    evidence: List[str]
    relevance: float = Field(..., ge=0.0, le=1.0)
    confidence: str  # "High", "Medium", "Low"
    certification_status: str  # Exactly source-bound from DB


class AnalysisResponse(BaseModel):
    id: str
    original_requirement: str
    structured_requirement: StructuredRequirement
    recommendations: List[RecommendationItem]  # Primary recommendations
    candidate_standards: List[RecommendationItem]  # Evaluated candidates / related standards
    version_alerts: List[VersionAlertItem]
    created_at: str
