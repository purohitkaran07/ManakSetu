"""
Vector Store for ManakSetu.
Precomputes and caches 384-dimensional embeddings for Indian Standards using:
sentence-transformers/all-MiniLM-L6-v2.

Strict Fingerprinting:
id, standard_number, title, scope, standard_type, classification,
certification_status, status, year, model_name, embedding_dim.
"""
import os
import json
import hashlib
from pathlib import Path
from typing import List, Dict, Any, Tuple, Optional
import numpy as np
from scipy.special import erf

# Cache paths
DATA_DIR = Path(__file__).resolve().parent.parent.parent / "data"
CACHE_NPY = DATA_DIR / "vector_cache.npy"
INDEX_JSON = DATA_DIR / "vector_index.json"

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
EMBEDDING_DIM = 384


class SemanticRetrievalUnavailableError(Exception):
    """Raised when the semantic embedding model fails to initialize or is unavailable."""
    pass


class MiniLMInferenceEngine:
    """
    Memory-safe pure NumPy inference for sentence-transformers/all-MiniLM-L6-v2.
    Loads official safetensors weights directly without duplicating arrays in memory.
    Zero PyTorch dependency: stays well below Render Free's 512MB RAM constraint.
    Produces exact, genuine 384-dimensional L2-normalized sentence embeddings.
    """

    def __init__(self, repo_id: str = MODEL_NAME):
        self.repo_id = repo_id
        self._tokenizer = None
        self._weights = None
        self._load()

    def _load(self):
        try:
            from huggingface_hub import hf_hub_download
            from tokenizers import Tokenizer
            from safetensors.numpy import load_file

            # Fast local cache check first (no network request or rate limit warning)
            try:
                tok_file = hf_hub_download(repo_id=self.repo_id, filename="tokenizer.json", local_files_only=True)
                weights_file = hf_hub_download(repo_id=self.repo_id, filename="model.safetensors", local_files_only=True)
            except Exception:
                tok_file = hf_hub_download(repo_id=self.repo_id, filename="tokenizer.json")
                weights_file = hf_hub_download(repo_id=self.repo_id, filename="model.safetensors")

            self._tokenizer = Tokenizer.from_file(tok_file)
            # Store single direct copy of safetensors weights (~90MB RAM total, zero duplicates)
            self._weights = load_file(weights_file)
        except Exception as e:
            raise SemanticRetrievalUnavailableError(
                f"Failed to load sentence-transformers weights ({self.repo_id}): {e}"
            )

    @staticmethod
    def _layer_norm(x: np.ndarray, weight: np.ndarray, bias: np.ndarray, eps: float = 1e-12) -> np.ndarray:
        mean = np.mean(x, axis=-1, keepdims=True)
        var = np.var(x, axis=-1, keepdims=True)
        return weight * (x - mean) / np.sqrt(var + eps) + bias

    @staticmethod
    def _gelu(x: np.ndarray) -> np.ndarray:
        return 0.5 * x * (1.0 + erf(x / np.sqrt(2.0)))

    def encode(self, texts: List[str]) -> np.ndarray:
        """Encodes list of texts into shape (N, 384) L2-normalized embeddings using weights directly."""
        if isinstance(texts, str):
            texts = [texts]

        embeddings_list = []
        w = self._weights
        scale = 1.0 / np.sqrt(32.0)

        for text in texts:
            encoded = self._tokenizer.encode(text)
            input_ids = np.array(encoded.ids)
            attention_mask = np.array(encoded.attention_mask)
            seq_len = len(input_ids)

            # Cap sequence length if excessively long
            if seq_len > 512:
                input_ids = input_ids[:512]
                attention_mask = attention_mask[:512]
                seq_len = 512

            positions = np.arange(seq_len)

            # 1. Embedding layer (accessed directly from single weights dict)
            w_emb = w["embeddings.word_embeddings.weight"][input_ids]
            p_emb = w["embeddings.position_embeddings.weight"][positions]
            t_emb = w["embeddings.token_type_embeddings.weight"][np.zeros(seq_len, dtype=int)]
            x = w_emb + p_emb + t_emb
            x = self._layer_norm(x, w["embeddings.LayerNorm.weight"], w["embeddings.LayerNorm.bias"])

            pad_mask = (1.0 - attention_mask)[None, None, :] * -10000.0

            # 2. 6 Transformer encoder layers
            for i in range(6):
                pfx = f"encoder.layer.{i}."

                W_q = w[pfx + "attention.self.query.weight"].T
                b_q = w[pfx + "attention.self.query.bias"]
                W_k = w[pfx + "attention.self.key.weight"].T
                b_k = w[pfx + "attention.self.key.bias"]
                W_v = w[pfx + "attention.self.value.weight"].T
                b_v = w[pfx + "attention.self.value.bias"]

                Q = (x @ W_q + b_q).reshape(seq_len, 12, 32).transpose(1, 0, 2)
                K = (x @ W_k + b_k).reshape(seq_len, 12, 32).transpose(1, 0, 2)
                V = (x @ W_v + b_v).reshape(seq_len, 12, 32).transpose(1, 0, 2)

                scores = (Q @ K.transpose(0, 2, 1)) * scale + pad_mask
                exp_scores = np.exp(scores - np.max(scores, axis=-1, keepdims=True))
                probs = exp_scores / np.sum(exp_scores, axis=-1, keepdims=True)

                context = (probs @ V).transpose(1, 0, 2).reshape(seq_len, 384)

                attn_out = context @ w[pfx + "attention.output.dense.weight"].T + w[pfx + "attention.output.dense.bias"]
                x = self._layer_norm(
                    x + attn_out,
                    w[pfx + "attention.output.LayerNorm.weight"],
                    w[pfx + "attention.output.LayerNorm.bias"],
                )

                inter = self._gelu(x @ w[pfx + "intermediate.dense.weight"].T + w[pfx + "intermediate.dense.bias"])
                ffn_out = inter @ w[pfx + "output.dense.weight"].T + w[pfx + "output.dense.bias"]
                x = self._layer_norm(
                    x + ffn_out,
                    w[pfx + "output.LayerNorm.weight"],
                    w[pfx + "output.LayerNorm.bias"],
                )

            # 3. Mean pooling
            mask_exp = attention_mask[:, None]
            sum_emb = np.sum(x * mask_exp, axis=0)
            sum_mask = np.maximum(np.sum(mask_exp, axis=0), 1e-9)
            pooled = sum_emb / sum_mask

            # 4. L2 normalization
            norm = np.linalg.norm(pooled)
            normalized = pooled / max(norm, 1e-9)
            embeddings_list.append(normalized)

        return np.array(embeddings_list, dtype=np.float32)


# Process-level singleton: lazily initialized on first analyze request, reused thereafter
_global_model: Optional[MiniLMInferenceEngine] = None
_global_cached_fingerprint: Optional[str] = None
_global_cached_embeddings: Optional[np.ndarray] = None
_global_cached_ids: Optional[List[int]] = None
_global_query_cache: Dict[str, np.ndarray] = {}
_MAX_QUERY_CACHE: int = 20  # Strict memory cap to stay well below 512MB


class VectorStore:
    def __init__(self, model_name: str = MODEL_NAME, embedding_dim: int = EMBEDDING_DIM):
        self.model_name = model_name
        self.embedding_dim = embedding_dim
        self._is_available = True
        self._error_message = None

    def _load_model(self) -> MiniLMInferenceEngine:
        global _global_model
        if _global_model is not None:
            return _global_model

        # Only ONE embedding model implementation: lightweight pure-NumPy MiniLM.
        # Zero PyTorch/SentenceTransformers import to guarantee staying under 512MB.
        try:
            _global_model = MiniLMInferenceEngine(self.model_name)
            return _global_model
        except Exception as e:
            self._is_available = False
            self._error_message = str(e)
            raise SemanticRetrievalUnavailableError(
                f"Semantic retrieval model '{self.model_name}' could not be initialized: {e}"
            )

    @property
    def is_available(self) -> bool:
        if not self._is_available:
            return False
        try:
            self._load_model()
            return True
        except Exception:
            return False

    @staticmethod
    def compute_standard_text(standard: Any) -> str:
        """
        Build rich textual representation of a standard for embedding.
        Contains standard number, title, scope, type, classification, certification status, and source reference.
        """
        parts = [
            f"Standard: {standard.standard_number}",
            f"Title: {standard.title}",
            f"Type: {standard.standard_type}",
            f"Classification: {standard.classification}",
            f"Status: {standard.status} ({standard.year})",
            f"Certification: {standard.certification_status}",
            f"Scope: {standard.scope}",
        ]
        if getattr(standard, "source_reference", None):
            parts.append(f"Source: {standard.source_reference}")
        return " | ".join(parts)

    def compute_fingerprint(self, standards: List[Any]) -> str:
        """
        Computes strict SHA-256 fingerprint from:
        id, standard_number, title, scope, standard_type, classification,
        certification_status, source_reference, status, year, model_name, embedding_dim.
        """
        records = []
        for s in sorted(standards, key=lambda x: x.id):
            records.append({
                "id": s.id,
                "standard_number": s.standard_number,
                "title": s.title,
                "scope": s.scope,
                "standard_type": s.standard_type,
                "classification": s.classification,
                "certification_status": s.certification_status,
                "source_reference": getattr(s, "source_reference", None),
                "status": s.status,
                "year": s.year,
            })
        payload = {
            "standards": records,
            "model_name": self.model_name,
            "embedding_dim": self.embedding_dim,
        }
        serialized = json.dumps(payload, sort_keys=True)
        return hashlib.sha256(serialized.encode("utf-8")).hexdigest()

    def load_cache(self, current_fingerprint: str) -> Optional[Tuple[np.ndarray, List[int]]]:
        """
        Returns (embeddings_matrix, list_of_standard_ids) if cache exists and fingerprint matches.
        Uses in-memory cache first, falls back to disk.
        """
        global _global_cached_fingerprint, _global_cached_embeddings, _global_cached_ids
        if (
            _global_cached_fingerprint == current_fingerprint
            and _global_cached_embeddings is not None
            and _global_cached_ids is not None
        ):
            return _global_cached_embeddings, _global_cached_ids

        if not CACHE_NPY.exists() or not INDEX_JSON.exists():
            return None

        try:
            with open(INDEX_JSON, "r", encoding="utf-8") as f:
                index_data = json.load(f)

            if index_data.get("fingerprint") != current_fingerprint:
                return None

            embeddings = np.load(str(CACHE_NPY))
            if embeddings.shape[1] != self.embedding_dim:
                return None

            ids = index_data.get("ids", [])
            if len(ids) != embeddings.shape[0]:
                return None

            _global_cached_fingerprint = current_fingerprint
            _global_cached_embeddings = embeddings
            _global_cached_ids = ids
            return embeddings, ids
        except Exception:
            return None

    def save_cache(self, embeddings: np.ndarray, ids: List[int], fingerprint: str):
        """Saves precomputed embeddings and index with fingerprint in RAM and on disk."""
        global _global_cached_fingerprint, _global_cached_embeddings, _global_cached_ids
        _global_cached_fingerprint = fingerprint
        _global_cached_embeddings = embeddings
        _global_cached_ids = ids

        DATA_DIR.mkdir(parents=True, exist_ok=True)
        np.save(str(CACHE_NPY), embeddings)
        index_data = {
            "fingerprint": fingerprint,
            "model_name": self.model_name,
            "embedding_dim": self.embedding_dim,
            "ids": ids,
        }
        with open(INDEX_JSON, "w", encoding="utf-8") as f:
            json.dump(index_data, f, indent=2)

    def get_or_build_embeddings(self, standards: List[Any]) -> Tuple[np.ndarray, List[int]]:
        """
        Retrieves cached embeddings if fingerprint matches, else computes and caches them.
        """
        if not standards:
            return np.empty((0, self.embedding_dim), dtype=np.float32), []

        fingerprint = self.compute_fingerprint(standards)
        cached = self.load_cache(fingerprint)
        if cached is not None:
            return cached

        model = self._load_model()
        texts = [self.compute_standard_text(s) for s in standards]
        ids = [s.id for s in standards]

        # Call encode
        raw_embeddings = model.encode(texts)
        embeddings_matrix = np.array(raw_embeddings, dtype=np.float32)

        self.save_cache(embeddings_matrix, ids, fingerprint)
        return embeddings_matrix, ids

    def encode_query(self, query_text: str) -> np.ndarray:
        """Encodes query string into a normalized 384-d vector with fast in-memory caching."""
        global _global_query_cache
        if query_text in _global_query_cache:
            return _global_query_cache[query_text]

        model = self._load_model()
        raw_emb = model.encode([query_text])
        query_vector = np.array(raw_emb[0], dtype=np.float32)

        # Cache query vector
        if len(_global_query_cache) >= _MAX_QUERY_CACHE:
            _global_query_cache.pop(next(iter(_global_query_cache)))
        _global_query_cache[query_text] = query_vector

        return query_vector

