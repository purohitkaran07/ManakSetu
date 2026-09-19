from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import get_db
from app.models.standard import Standard
from app.models.relationship import StandardRelationship
from app.schemas.standard import StandardResponse, StandardDetailResponse, RelationshipItem

router = APIRouter(prefix="/api/standards", tags=["Standards"])


@router.get("", response_model=List[StandardResponse])
def list_standards(
    q: Optional[str] = Query(None, description="Search query across standard number, title, or scope"),
    classification: Optional[str] = Query(None, description="Filter by classification"),
    status: Optional[str] = Query(None, description="Filter by status (Active, Superseded)"),
    db: Session = Depends(get_db),
):
    query = db.query(Standard)

    if q:
        term = f"%{q.strip()}%"
        query = query.filter(
            or_(
                Standard.standard_number.ilike(term),
                Standard.title.ilike(term),
                Standard.scope.ilike(term),
            )
        )

    if classification:
        query = query.filter(Standard.classification.ilike(f"%{classification}%"))

    if status:
        query = query.filter(Standard.status.ilike(status))

    standards = query.order_by(Standard.id).all()
    return standards


@router.get("/{standard_id}", response_model=StandardDetailResponse)
def get_standard_detail(
    standard_id: int,
    db: Session = Depends(get_db),
):
    standard = db.query(Standard).filter(Standard.id == standard_id).first()
    if not standard:
        raise HTTPException(status_code=404, detail=f"Standard with ID {standard_id} not found.")

    # Fetch outgoing relationships
    outgoing = (
        db.query(StandardRelationship, Standard)
        .join(Standard, Standard.id == StandardRelationship.target_standard_id)
        .filter(StandardRelationship.source_standard_id == standard_id)
        .all()
    )

    # Fetch incoming relationships
    incoming = (
        db.query(StandardRelationship, Standard)
        .join(Standard, Standard.id == StandardRelationship.source_standard_id)
        .filter(StandardRelationship.target_standard_id == standard_id)
        .all()
    )

    relationships_list: List[RelationshipItem] = []

    for rel, target in outgoing:
        relationships_list.append(
            RelationshipItem(
                id=rel.id,
                relationship_type=rel.relationship_type,
                related_standard_id=target.id,
                related_standard_number=target.standard_number,
                related_standard_title=target.title,
                direction="outgoing",
            )
        )

    for rel, source in incoming:
        # For incoming, invert direction label for clarity
        rel_type = rel.relationship_type
        if rel_type.upper() == "REFERENCES":
            inverted_type = "REFERRED_BY"
        elif rel_type.upper() == "SUPERSEDES":
            inverted_type = "SUPERSEDED_BY"
        else:
            inverted_type = rel_type

        relationships_list.append(
            RelationshipItem(
                id=rel.id,
                relationship_type=inverted_type,
                related_standard_id=source.id,
                related_standard_number=source.standard_number,
                related_standard_title=source.title,
                direction="incoming",
            )
        )

    resp = StandardDetailResponse.model_validate(standard)
    resp.relationships = relationships_list
    return resp


@router.get("/{standard_id}/relationships", response_model=List[RelationshipItem])
def get_standard_relationships(
    standard_id: int,
    db: Session = Depends(get_db),
):
    detail = get_standard_detail(standard_id, db)
    return detail.relationships
