from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.requirement import RequirementRequest
from app.schemas.recommendation import AnalysisResponse
from app.services.recommendation_engine import get_recommendation_engine

router = APIRouter(prefix="/api", tags=["Analyze"])


@router.post("/analyze", response_model=AnalysisResponse)
def analyze_requirement(
    payload: RequirementRequest,
    db: Session = Depends(get_db),
):
    text = payload.requirement.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Requirement text cannot be empty.")

    engine = get_recommendation_engine()
    try:
        response = engine.analyze(db, text, provider=payload.llm_provider)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
