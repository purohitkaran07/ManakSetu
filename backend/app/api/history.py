from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.analysis import Analysis

router = APIRouter(prefix="/api/history", tags=["History"])


@router.get("", response_model=List[Dict[str, Any]])
def get_analysis_history(db: Session = Depends(get_db)):
    analyses = db.query(Analysis).order_by(Analysis.created_at.desc()).limit(50).all()
    history_items = []
    for a in analyses:
        recs = a.recommendations or []
        top_stds = [r.get("standard", {}).get("standard_number") for r in recs[:3] if r.get("standard")]
        alerts = a.version_alerts or []

        history_items.append({
            "id": a.id,
            "original_requirement": a.original_requirement,
            "product": a.structured_requirement.get("product") if a.structured_requirement else None,
            "recommendations_count": len(recs),
            "top_standards": top_stds,
            "has_version_alerts": len(alerts) > 0,
            "created_at": a.created_at.isoformat() if a.created_at else None,
        })
    return history_items


@router.get("/{analysis_id}")
def get_analysis_by_id(analysis_id: str, db: Session = Depends(get_db)):
    record = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not record:
        raise HTTPException(status_code=404, detail=f"Analysis with ID {analysis_id} not found.")

    return {
        "id": record.id,
        "original_requirement": record.original_requirement,
        "structured_requirement": record.structured_requirement,
        "recommendations": record.recommendations,
        "candidate_standards": [],
        "version_alerts": record.version_alerts,
        "created_at": record.created_at.isoformat() if record.created_at else None,
    }
