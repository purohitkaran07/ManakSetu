import os
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Locate DB in backend/data directory relative to this file
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)

DB_PATH = DATA_DIR / "manaksetu.db"
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{DB_PATH}")

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {},
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def init_db():
    import app.models  # noqa: F401 - ensure models are registered on Base
    Base.metadata.create_all(bind=engine)


# Auto-initialize tables safely (idempotent CREATE TABLE IF NOT EXISTS)
init_db()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
