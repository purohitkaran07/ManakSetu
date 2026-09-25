#!/usr/bin/env python3
"""
ManakSetu Database Seeder Script.
Initializes the SQLite schema and seeds verified Indian Standards & relationships.
Safe to run idempotently on fresh or existing databases.
"""
import sys
from pathlib import Path

# Add backend directory to sys.path
BASE_DIR = Path(__file__).resolve().parent.parent
BACKEND_DIR = BASE_DIR / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.database import Base, engine, SessionLocal
from app.seed.seed_standards import seed_database
from app.models.standard import Standard
from app.models.relationship import StandardRelationship


def run_seed():
    print("=" * 60)
    print("  MANAKSETU: Seeding Database with Indian Standards")
    print("=" * 60)
    
    print("Creating tables (if not already existing)...")
    Base.metadata.create_all(bind=engine)
    
    print("Populating verified standards and relationships...")
    seed_database()
    
    db = SessionLocal()
    try:
        standards_count = db.query(Standard).count()
        relationships_count = db.query(StandardRelationship).count()
        print(f"\n[SUCCESS] Database seeded successfully!")
        print(f"  - Total Standards:     {standards_count}")
        print(f"  - Total Relationships: {relationships_count}")
    finally:
        db.close()


if __name__ == "__main__":
    run_seed()
