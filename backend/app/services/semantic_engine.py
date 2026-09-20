"""
Semantic Engine service orchestrating vector storage and semantic retrieval.
"""
from typing import List, Tuple, Any
from app.ai.vector_store import VectorStore
from app.ai.semantic_retriever import SemanticRetriever
from app.schemas.requirement import StructuredRequirement

# Singleton instance
_vector_store = VectorStore()
_retriever = SemanticRetriever(vector_store=_vector_store)


def get_vector_store() -> VectorStore:
    return _vector_store


def get_semantic_retriever() -> SemanticRetriever:
    return _retriever


def retrieve_candidate_standards(
    standards: List[Any],
    structured_req: StructuredRequirement,
    raw_text: str,
    top_k: int = 10,
) -> List[Tuple[int, float]]:
    return _retriever.retrieve(standards, structured_req, raw_text, top_k=top_k)
