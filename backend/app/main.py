from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.seed.seed_standards import seed_database
from app.api import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure tables exist and seed database
    Base.metadata.create_all(bind=engine)
    seed_database()
    yield
    # Shutdown logic if needed


app = FastAPI(
    title="ManakSetu API",
    description=(
        "AI-Powered Indian Standards Decision Support System. "
        "SIH 2026 Prototype. Note: ManakSetu is an AI decision-support platform, "
        "not an official BIS portal."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

# Configure CORS for Vite development and local production previews
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all API routes
app.include_router(api_router)


@app.get("/")
def root():
    return {
        "service": "ManakSetu API",
        "tagline": "From Requirement to the Right Standard",
        "docs": "/docs",
        "health": "/api/health",
        "version": "1.0.0",
    }
