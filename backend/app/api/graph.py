import math
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.standard import Standard
from app.models.relationship import StandardRelationship
from app.schemas.graph import GraphResponse, GraphNode, GraphEdge, GraphNodeData

router = APIRouter(prefix="/api/graph", tags=["Knowledge Graph"])


@router.get("", response_model=GraphResponse)
def get_knowledge_graph(
    central_id: Optional[int] = Query(1, description="Central node ID for graph visualization layout"),
    relationship_type: Optional[str] = Query(None, description="Filter edges by relationship type"),
    db: Session = Depends(get_db),
):
    standards = db.query(Standard).order_by(Standard.id).all()
    rel_query = db.query(StandardRelationship)
    if relationship_type:
        rel_query = rel_query.filter(StandardRelationship.relationship_type.ilike(relationship_type))
    relationships = rel_query.all()

    # Layout geometry calculation for React Flow
    nodes = []
    edges = []

    # Place central node at (400, 250)
    center_x, center_y = 420.0, 260.0
    radius = 240.0

    # Separate central standard from others
    other_standards = [s for s in standards if s.id != central_id]
    central_standard = next((s for s in standards if s.id == central_id), None)

    if central_standard:
        nodes.append(
            GraphNode(
                id=str(central_standard.id),
                type="customStandardNode",
                data=GraphNodeData(
                    id=central_standard.id,
                    standard_number=central_standard.standard_number,
                    title=central_standard.title,
                    standard_type=central_standard.standard_type,
                    status=central_standard.status,
                    certification_status=central_standard.certification_status,
                    year=central_standard.year,
                    is_central=True,
                ),
                position={"x": center_x, "y": center_y},
            )
        )

    num_others = len(other_standards)
    for idx, std in enumerate(other_standards):
        # Calculate circular angle around center
        angle = (2 * math.pi / max(num_others, 1)) * idx - (math.pi / 2)
        node_x = center_x + radius * math.cos(angle)
        node_y = center_y + radius * math.sin(angle)

        nodes.append(
            GraphNode(
                id=str(std.id),
                type="customStandardNode",
                data=GraphNodeData(
                    id=std.id,
                    standard_number=std.standard_number,
                    title=std.title,
                    standard_type=std.standard_type,
                    status=std.status,
                    certification_status=std.certification_status,
                    year=std.year,
                    is_central=False,
                ),
                position={"x": round(node_x, 1), "y": round(node_y, 1)},
            )
        )

    # Build edges from actual database relationships
    for rel in relationships:
        is_ref = rel.relationship_type.upper() == "REFERENCES"
        is_supersedes = rel.relationship_type.upper() == "SUPERSEDES"
        edges.append(
            GraphEdge(
                id=f"e{rel.id}-{rel.source_standard_id}-{rel.target_standard_id}",
                source=str(rel.source_standard_id),
                target=str(rel.target_standard_id),
                label=rel.relationship_type,
                animated=is_ref,
                type="smoothstep",
            )
        )

    return GraphResponse(nodes=nodes, edges=edges)
