from fastapi import APIRouter
from app.api.health import router as health_router
from app.api.analyze import router as analyze_router
from app.api.standards import router as standards_router
from app.api.graph import router as graph_router
from app.api.history import router as history_router
from app.api.auth import router as auth_router

api_router = APIRouter()
api_router.include_router(health_router)
api_router.include_router(analyze_router)
api_router.include_router(standards_router)
api_router.include_router(graph_router)
api_router.include_router(history_router)
api_router.include_router(auth_router)

__all__ = ["api_router"]
