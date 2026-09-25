#!/usr/bin/env python3
"""
ManakSetu Vector Cache Builder Script.
Computes 384-dimensional embeddings for all standards in the database
using sentence-transformers/all-MiniLM-L6-v2 and writes vector_cache.npy
and vector_index.json with strict SHA-256 fingerprinting.
"""
import sys
from pathlib import Path

# Add backend directory to sys.path
BASE_DIR = Path(__file__).resolve().parent.parent
BACKEND_DIR = BASE_DIR / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.database import SessionLocal
from app.models.standard import Standard
from app.ai.vector_store import VectorStore, CACHE_NPY, INDEX_JSON


def run_build():
    print("=" * 60)
    print("  MANAKSETU: Building Semantic Vector Cache")
    print("=" * 60)
    
    db = SessionLocal()
    try:
        standards = db.query(Standard).all()
        if not standards:
            print("[ERROR] No standards found in database. Run seed_database.py first.")
            sys.exit(1)
        
        print(f"Found {len(standards)} standards in database. Computing embeddings...")
        store = VectorStore()
        fingerprint = store.compute_fingerprint(standards)
        print(f"Fingerprint (SHA-256): {fingerprint}")
        
        embeddings, ids = store.get_or_build_embeddings(standards)
        
        print(f"\n[SUCCESS] Vector cache generated successfully!")
        print(f"  - Embeddings matrix shape: {embeddings.shape}")
        print(f"  - Indexed standard IDs:    {ids}")
        print(f"  - Binary cache path:       {CACHE_NPY}")
        print(f"  - Metadata index path:     {INDEX_JSON}")
    finally:
        db.close()


if __name__ == "__main__":
    run_build()
