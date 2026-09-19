"""
Semantic Retriever for ManakSetu.
Computes cosine similarity between requirement query embedding and standard embeddings.
Domain-general, without arbitrary score boosts or keyword exclusion rules.
"""
from typing import List, Tuple, Any
import numpy as np
from app.ai.vector_store import VectorStore, SemanticRetrievalUnavailableError
from app.schemas.requirement import StructuredRequirement


class SemanticRetriever:
    def __init__(self, vector_store: VectorStore = None):
        self.vector_store = vector_store or VectorStore()

    @staticmethod
    def build_query_text(structured_req: StructuredRequirement, raw_text: str = "") -> str:
        """
        Builds a comprehensive semantic query from structured entities and original text.
        """
        components = []
        if structured_req.product:
            components.append(f"Product: {structured_req.product}")
        if structured_req.product_category:
            components.append(f"Category: {structured_req.product_category}")
        if structured_req.specifications:
            specs_str = ", ".join(f"{k}: {v}" for k, v in structured_req.specifications.items())
            components.append(f"Specifications: {specs_str}")
        if structured_req.installation:
            components.append(f"Installation: {structured_req.installation}")
        if structured_req.application:
            components.append(f"Application: {structured_req.application}")

        # If entities were extracted, combine them; also include raw text context
        if components:
            return " | ".join(components) + f" | Details: {raw_text.strip()}"
        return raw_text.strip()

    def retrieve(
        self,
        standards: List[Any],
        structured_req: StructuredRequirement,
        raw_text: str,
        top_k: int = 10,
    ) -> List[Tuple[int, float]]:
        """
        Retrieves top_k standards based on cosine similarity.
        Returns list of (standard_id, similarity_score) sorted descending.
        """
        if not standards:
            return []

        embeddings_matrix, ids = self.vector_store.get_or_build_embeddings(standards)
        query_text = self.build_query_text(structured_req, raw_text)
        query_vector = self.vector_store.encode_query(query_text)

        # Dot product of L2-normalized vectors is exact cosine similarity
        similarities = np.dot(embeddings_matrix, query_vector)

        # Pair each id with its similarity score
        scored_pairs = []
        for std_id, score in zip(ids, similarities):
            scored_pairs.append((std_id, float(score)))

        # Sort descending by similarity score
        scored_pairs.sort(key=lambda x: x[1], reverse=True)
        return scored_pairs[:top_k]
