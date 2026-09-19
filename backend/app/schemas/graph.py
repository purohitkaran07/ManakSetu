from typing import List, Optional, Dict, Any
from pydantic import BaseModel


class GraphNodeData(BaseModel):
    id: int
    standard_number: str
    title: str
    standard_type: str
    status: str
    certification_status: str
    year: int
    is_central: bool = False


class GraphNode(BaseModel):
    id: str
    type: Optional[str] = "customStandardNode"
    data: GraphNodeData
    position: Optional[Dict[str, float]] = None


class GraphEdge(BaseModel):
    id: str
    source: str
    target: str
    label: str
    animated: bool = False
    type: Optional[str] = "smoothstep"


class GraphResponse(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]
