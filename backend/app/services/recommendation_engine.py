"""
Recommendation Engine for ManakSetu.
Orchestrates requirement parsing, semantic candidate retrieval,
domain-general evidence evaluation, and strict version alerting.
Separates CANDIDATES from RECOMMENDATIONS.
"""
from abc import ABC, abstractmethod
from typing import List, Tuple, Dict, Any, Optional
import uuid
from datetime import datetime, timezone
import logging
from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)

from app.models.standard import Standard
from app.models.relationship import StandardRelationship
from app.models.analysis import Analysis
from app.schemas.standard import StandardResponse
from app.schemas.requirement import StructuredRequirement
from app.schemas.recommendation import (
    RecommendationItem,
    VersionAlertItem,
    AnalysisResponse,
)
from app.ai.requirement_analyzer import get_requirement_analyzer
from app.services.semantic_engine import get_semantic_retriever
from app.services.version_service import detect_version_alerts


class BaseRecommendationEngine(ABC):
    @abstractmethod
    def extract_requirements(self, text: str, provider: str = "none") -> StructuredRequirement:
        pass

    @abstractmethod
    def retrieve_candidates(
        self,
        standards: List[Standard],
        structured_req: StructuredRequirement,
        raw_text: str,
    ) -> List[Tuple[Standard, float]]:
        pass

    @abstractmethod
    def evaluate_evidence(
        self,
        standard: Standard,
        structured_req: StructuredRequirement,
        similarity_score: float,
        relationships: List[StandardRelationship],
        primary_ids: List[int],
    ) -> RecommendationItem:
        pass

    @abstractmethod
    def detect_version_alerts(
        self,
        explicit_standards: List[str],
        standards: List[Standard],
        relationships: List[StandardRelationship],
    ) -> List[VersionAlertItem]:
        pass

    @abstractmethod
    def analyze(self, db: Session, text: str, provider: str = "none") -> AnalysisResponse:
        pass


class ManakSetuRecommendationEngine(BaseRecommendationEngine):
    """
    Production SIH 2026 recommendation engine.
    Domain-general evidence evaluation without hardcoded standard boosts or keyword exclusions.
    """

    # Domain-general semantic relevance thresholds
    PRIMARY_SCORE_THRESHOLD = 0.42
    CANDIDATE_SCORE_THRESHOLD = 0.28

    def extract_requirements(self, text: str, provider: str = "none") -> StructuredRequirement:
        analyzer = get_requirement_analyzer(provider)
        return analyzer.analyze(text)

    def retrieve_candidates(
        self,
        standards: List[Standard],
        structured_req: StructuredRequirement,
        raw_text: str,
    ) -> List[Tuple[Standard, float]]:
        retriever = get_semantic_retriever()
        scored_pairs = retriever.retrieve(standards, structured_req, raw_text, top_k=len(standards))
        standards_by_id = {s.id: s for s in standards}

        result = []
        for std_id, score in scored_pairs:
            std = standards_by_id.get(std_id)
            if std:
                result.append((std, score))
        return result

    def detect_version_alerts(
        self,
        explicit_standards: List[str],
        standards: List[Standard],
        relationships: List[StandardRelationship],
    ) -> List[VersionAlertItem]:
        return detect_version_alerts(explicit_standards, standards, relationships)

    def evaluate_evidence(
        self,
        standard: Standard,
        structured_req: StructuredRequirement,
        similarity_score: float,
        relationships: List[StandardRelationship],
        primary_ids: List[int],
    ) -> RecommendationItem:
        evidence: List[str] = []
        reasons: List[str] = []

        title_lower = standard.title.lower()
        scope_lower = standard.scope.lower()
        product = (structured_req.product or "").lower()

        # 1. Product & Title / Scope Alignment
        if product:
            product_words = [w for w in product.split() if len(w) > 3]
            matching_words = [w for w in product_words if w in title_lower or w in scope_lower]
            if matching_words:
                evidence.append(f"Product domain '{structured_req.product}' aligns with standard title and scope.")
                reasons.append(f"Direct technical match for {structured_req.product}.")

        # 2. Category / Classification Alignment
        if structured_req.product_category and structured_req.product_category.lower() in standard.classification.lower():
            evidence.append(f"Standard classification '{standard.classification}' matches requirement category.")

        # 3. Explicit Reference Evidence
        is_explicit = any(
            standard.standard_number.lower() in exp.lower() or exp.lower() in standard.standard_number.lower()
            for exp in structured_req.explicitly_mentioned_standards
        )
        if is_explicit:
            evidence.append(f"Explicitly referenced by user requirement ('{standard.standard_number}').")
            reasons.append("Matches user's explicit standard specification.")

        # 4. Standard Type & Role
        if "product specification" in standard.standard_type.lower():
            evidence.append(f"Standard provides primary product specifications and constructional requirements.")
            if not reasons:
                reasons.append(f"Product specification standard for {standard.title.split('-')[0].strip()}.")
        elif "safety" in standard.standard_type.lower():
            evidence.append(f"Standard provides essential safety requirements for appliance operation and protection.")
            if not reasons:
                reasons.append(f"Applicable safety requirements under {standard.standard_type}.")
        elif "control" in standard.standard_type.lower():
            evidence.append(f"Standard specifies control and protective component requirements.")

        # 5. Normative Relationship Evidence
        # Check if this standard is referenced by any primary standard
        referencing_primaries = []
        for rel in relationships:
            if rel.relationship_type.upper() == "REFERENCES" and rel.target_standard_id == standard.id:
                if rel.source_standard_id in primary_ids and rel.source_standard_id != standard.id:
                    src = next((s for s in relationships if hasattr(s, 'id') and s.id == rel.source_standard_id), None)
                    # Use relationship source ID
                    referencing_primaries.append(rel.source_standard_id)

        if referencing_primaries:
            evidence.append("Normatively referenced by primary applicable standard.")

        # 6. Status note
        if standard.status.lower() == "superseded":
            evidence.append(f"Note: This edition ({standard.year}) is superseded by a newer revision.")

        # Default fallback evidence if none matched
        if not evidence:
            evidence.append(f"Semantic similarity score: {similarity_score:.2f} based on contextual embedding matching.")
        if not reasons:
            reasons.append(f"Candidate standard with semantic alignment score of {similarity_score:.2f}.")

        # Confidence banding
        if similarity_score >= 0.60 or is_explicit:
            confidence = "High"
        elif similarity_score >= 0.45:
            confidence = "Medium"
        else:
            confidence = "Low"

        # Construct StandardResponse
        std_resp = StandardResponse.model_validate(standard)

        return RecommendationItem(
            standard=std_resp,
            reason=" ".join(reasons),
            evidence=evidence,
            relevance=round(float(similarity_score), 4),
            confidence=confidence,
            certification_status=standard.certification_status,
        )

    def analyze(self, db: Session, text: str, provider: str = "none") -> AnalysisResponse:
        all_standards = db.query(Standard).all()
        all_relationships = db.query(StandardRelationship).all()

        # Step 1: Extract structured requirement
        structured_req = self.extract_requirements(text, provider=provider)

        # Step 2: Detect version alerts strictly from explicit references
        version_alerts = self.detect_version_alerts(
            structured_req.explicitly_mentioned_standards,
            all_standards,
            all_relationships,
        )

        # Step 3: Semantic retrieval of candidates
        scored_candidates = self.retrieve_candidates(all_standards, structured_req, text)

        # Step 4: Determine Primary Recommendations vs Candidate Standards
        # Primary recommendations:
        # - Semantic score >= PRIMARY_SCORE_THRESHOLD AND status == "Active"
        # - OR explicitly mentioned by user and status == "Active"
        primary_pairs = []
        candidate_pairs = []

        for std, score in scored_candidates:
            is_explicit = any(
                std.standard_number.lower() in exp.lower() or exp.lower() in std.standard_number.lower()
                for exp in structured_req.explicitly_mentioned_standards
            )

            # Do not recommend superseded standards as primary unless explicitly requested and no newer exists
            if (score >= self.PRIMARY_SCORE_THRESHOLD or is_explicit) and std.status.lower() == "active":
                primary_pairs.append((std, score))
            elif score >= self.CANDIDATE_SCORE_THRESHOLD:
                candidate_pairs.append((std, score))

        # Trace normative references of primary recommendations to add to candidates if not already present
        primary_ids = [s.id for s, _ in primary_pairs]
        for p_std, _ in primary_pairs:
            for rel in all_relationships:
                if rel.source_standard_id == p_std.id and rel.relationship_type.upper() == "REFERENCES":
                    ref_id = rel.target_standard_id
                    if ref_id not in primary_ids and not any(s.id == ref_id for s, _ in candidate_pairs):
                        ref_std = next((s for s in all_standards if s.id == ref_id), None)
                        if ref_std:
                            # Assign appropriate relationship score
                            candidate_pairs.append((ref_std, 0.40))

        # Step 5: Evaluate evidence for primary recommendations
        recommendations: List[RecommendationItem] = []
        for std, score in primary_pairs:
            item = self.evaluate_evidence(std, structured_req, score, all_relationships, primary_ids)
            recommendations.append(item)

        # Step 6: Evaluate evidence for candidate standards
        candidates: List[RecommendationItem] = []
        for std, score in candidate_pairs:
            item = self.evaluate_evidence(std, structured_req, score, all_relationships, primary_ids)
            candidates.append(item)

        # Sort recommendations and candidates by relevance descending
        recommendations.sort(key=lambda x: x.relevance, reverse=True)
        candidates.sort(key=lambda x: x.relevance, reverse=True)

        # Step 7: Persist analysis to database
        analysis_id = str(uuid.uuid4())
        created_at_dt = datetime.now(timezone.utc)
        created_at_str = created_at_dt.isoformat()

        analysis_record = Analysis(
            id=analysis_id,
            original_requirement=text,
            structured_requirement=structured_req.model_dump(),
            recommendations=[r.model_dump() for r in recommendations],
            version_alerts=[v.model_dump() for v in version_alerts],
            created_at=created_at_dt,
        )
        try:
            db.add(analysis_record)
            db.commit()
        except Exception as e:
            db.rollback()
            logger.warning(
                f"Could not persist analysis record to database (read-only filesystem or database write error): {e}"
            )

        return AnalysisResponse(
            id=analysis_id,
            original_requirement=text,
            structured_requirement=structured_req,
            recommendations=recommendations,
            candidate_standards=candidates,
            version_alerts=version_alerts,
            created_at=created_at_str,
        )


# Global singleton engine
_recommendation_engine = ManakSetuRecommendationEngine()


def get_recommendation_engine() -> BaseRecommendationEngine:
    return _recommendation_engine
