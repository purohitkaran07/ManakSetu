"""
Version Intelligence Service for ManakSetu.
Detects version deprecations and superseding standards strictly based on explicit user references.
"""
from typing import List, Dict, Any, Optional
from app.schemas.recommendation import VersionAlertItem


def detect_version_alerts(
    explicitly_mentioned_standards: List[str],
    all_standards: List[Any],
    all_relationships: List[Any],
) -> List[VersionAlertItem]:
    """
    Checks if any explicitly mentioned standard has been superseded by a newer edition.
    Returns alerts ONLY for explicit references that have a newer superseding standard.
    Never assumes an outdated version if the user did not explicitly mention it.
    """
    if not explicitly_mentioned_standards:
        return []

    alerts: List[VersionAlertItem] = []
    standards_by_number: Dict[str, Any] = {s.standard_number: s for s in all_standards}

    # Build supersedes map: superseded_standard_id -> superseding_standard
    supersedes_map: Dict[int, Any] = {}
    for rel in all_relationships:
        if rel.relationship_type.upper() == "SUPERSEDES":
            # rel.source_standard_id SUPERSEDES rel.target_standard_id
            # So target is superseded, source is newer
            superseding = next((s for s in all_standards if s.id == rel.source_standard_id), None)
            if superseding:
                supersedes_map[rel.target_standard_id] = superseding

    for explicit_ref in explicitly_mentioned_standards:
        matched_std = None
        # Exact match or normalized match
        for std_num, std in standards_by_number.items():
            if explicit_ref.lower() == std_num.lower():
                matched_std = std
                break

        if matched_std:
            # Check if this standard is superseded via SUPERSEDES relationship
            superseding_std = supersedes_map.get(matched_std.id)
            if superseding_std:
                alerts.append(
                    VersionAlertItem(
                        alert_type="NEWER_VERSION",
                        explicit_standard=matched_std.standard_number,
                        superseding_standard=superseding_std.standard_number,
                        message=(
                            f"You explicitly referenced '{matched_std.standard_number}'. "
                            f"A newer revised edition '{superseding_std.standard_number}' "
                            f"is available in the Indian Standards knowledge base."
                        ),
                    )
                )
            elif matched_std.status.lower() == "superseded":
                # If marked superseded but without explicit edge, find same base number with higher year
                base_part = matched_std.standard_number.split(":")[0]
                newer = [
                    s for s in all_standards
                    if s.standard_number.startswith(base_part) and s.year > matched_std.year and s.status.lower() == "active"
                ]
                if newer:
                    newer_std = sorted(newer, key=lambda x: x.year, reverse=True)[0]
                    alerts.append(
                        VersionAlertItem(
                            alert_type="NEWER_VERSION",
                            explicit_standard=matched_std.standard_number,
                            superseding_standard=newer_std.standard_number,
                            message=(
                                f"You explicitly referenced '{matched_std.standard_number}'. "
                                f"A newer revised edition '{newer_std.standard_number}' "
                                f"is available in the Indian Standards knowledge base."
                            ),
                        )
                    )

    return alerts
