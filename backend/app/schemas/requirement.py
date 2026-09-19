from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class RequirementRequest(BaseModel):
    requirement: str = Field(..., min_length=2, description="Natural language procurement or product requirement")
    llm_provider: Optional[str] = Field("none", description="LLM provider: 'none', 'gemini', 'openai', etc.")


class StructuredRequirement(BaseModel):
    product: Optional[str] = None
    product_category: Optional[str] = None
    quantity: Optional[int] = None
    specifications: Dict[str, Any] = Field(default_factory=dict)
    application: Optional[str] = None
    installation: Optional[str] = None
    procurement_context: Optional[str] = None
    explicitly_mentioned_standards: List[str] = Field(default_factory=list)
    inferred_fields: List[str] = Field(default_factory=list)
