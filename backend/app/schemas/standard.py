from typing import Optional, List, Any, Dict
from pydantic import BaseModel, ConfigDict


class StandardBase(BaseModel):
    standard_number: str
    title: str
    scope: str
    standard_type: str
    classification: str
    certification_status: str
    status: str
    year: int
    description: Optional[str] = None
    source_reference: Optional[str] = None
    meta_info: Optional[Dict[str, Any]] = None


class StandardResponse(StandardBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


class RelationshipItem(BaseModel):
    id: int
    relationship_type: str
    related_standard_id: int
    related_standard_number: str
    related_standard_title: str
    direction: str  # "outgoing" or "incoming"

    model_config = ConfigDict(from_attributes=True)


class StandardDetailResponse(StandardResponse):
    relationships: List[RelationshipItem] = []
