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


def warmup_semantic_engine():
    """
    Pre-warms the semantic engine during application startup:
    1. Pre-loads embedding model singleton into memory.
    2. Loads standard records and populates in-memory vector cache.
    3. Runs a fast warmup query pass so tokenizers, arrays, and inference graphs are hot.
    """
    import logging
    from app.database import SessionLocal
    from app.models.standard import Standard

    logger = logging.getLogger("manaksetu.semantic_engine")
    db = SessionLocal()
    try:
        standards = db.query(Standard).all()
        if standards:
            _vector_store.get_or_build_embeddings(standards)
        _vector_store.encode_query("warmup Indian Standards query")
        logger.info("[WARMUP] Semantic engine and vector cache pre-warmed successfully.")
    except Exception as e:
        logger.warning(f"[WARMUP] Semantic engine warmup notice: {e}")
    finally:
        db.close()

