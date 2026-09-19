import numpy as np
from app.ai.vector_store import VectorStore
from app.database import SessionLocal
from app.models.standard import Standard


def test_vector_store_embedding_dimension_and_cache():
    db = SessionLocal()
    standards = db.query(Standard).all()
    vs = VectorStore()

    # Verify embeddings matrix shape
    embeddings, ids = vs.get_or_build_embeddings(standards)
    assert embeddings.shape[0] == len(standards)
    assert embeddings.shape[1] == 384
    assert len(ids) == len(standards)

    # Test query encoding
    query_vec = vs.encode_query("electric water heater 25 litre")
    assert query_vec.shape == (384,)
    # Verify L2 normalization
    norm = np.linalg.norm(query_vec)
    assert np.isclose(norm, 1.0, atol=1e-3)

    db.close()


def test_vector_cache_fingerprint_invalidation():
    db = SessionLocal()
    standards = db.query(Standard).all()
    vs = VectorStore()

    fp1 = vs.compute_fingerprint(standards)

    # Create dummy modified standard to test fingerprint change
    dummy = Standard(
        id=999,
        standard_number="IS 9999:2026",
        title="Test Standard",
        scope="Test Scope",
        standard_type="Test Type",
        classification="Test Class",
        certification_status="Voluntary",
        status="Active",
        year=2026,
    )
    fp2 = vs.compute_fingerprint(standards + [dummy])

    assert fp1 != fp2, "Fingerprint should change when standards list changes"

    # Test that modifying scope changes fingerprint
    original_scope = standards[0].scope
    standards[0].scope = "Modified scope content for cache test"
    fp3 = vs.compute_fingerprint(standards)
    assert fp1 != fp3, "Fingerprint should change when scope changes"

    # Restore original scope
    standards[0].scope = original_scope
    db.close()
