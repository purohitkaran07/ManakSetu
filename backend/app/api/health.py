from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.standard import Standard
from app.ai.vector_store import MODEL_NAME, EMBEDDING_DIM
from app.services.semantic_engine import get_vector_store

router = APIRouter(prefix="/api", tags=["Health"])


@router.get("/health")
def get_health(db: Session = Depends(get_db)):
    db_ok = True
    standards_count = 0
    try:
        standards_count = db.query(Standard).count()
    except Exception:
        db_ok = False

    vector_store = get_vector_store()
    model_available = vector_store.is_available

    return {
        "status": "healthy" if db_ok and model_available else "degraded",
        "service": "ManakSetu AI Standards Decision Support",
        "version": "1.0.0 (SIH 2026)",
        "database": {
            "status": "connected" if db_ok else "disconnected",
            "standards_count": standards_count,
        },
        "model": {
            "name": MODEL_NAME,
            "embedding_dim": EMBEDDING_DIM,
            "status": "active" if model_available else "unavailable",
        },
    }
