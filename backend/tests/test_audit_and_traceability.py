from app.database import SessionLocal
from app.models.standard import Standard
from app.models.relationship import StandardRelationship
from app.services.recommendation_engine import get_recommendation_engine

engine = get_recommendation_engine()


def test_standards_database_audit_and_traceability():
    """Verify all 6 standards exist with correct fields and source_reference traceability."""
    db = SessionLocal()
    standards = db.query(Standard).all()
    assert len(standards) == 6

    by_num = {s.standard_number: s for s in standards}

    # Verify IS 2082:2018 certification status is source-supported (not Voluntary, not QCO)
    is2082 = by_num["IS 2082:2018"]
    assert is2082.certification_status == "Mandatory Certification (BIS Scheme-I)"
    assert is2082.source_reference is not None
    assert "Product Manual" in is2082.source_reference
    assert is2082.status == "Active"

    # Verify IS 302 (Part 2/Sec 21):2024
    is302_2024 = by_num["IS 302 (Part 2/Sec 21):2024"]
    assert is302_2024.certification_status == "Safety Standard"
    assert is302_2024.status == "Active"
    assert is302_2024.source_reference is not None

    # Verify IS 302 (Part 2/Sec 21):2018 is Superseded
    is302_2018 = by_num["IS 302 (Part 2/Sec 21):2018"]
    assert is302_2018.status == "Superseded"

    # Verify IS 16923 is Measurement Standard
    is16923 = by_num["IS 16923 (Part 1):2018"]
    assert is16923.standard_type == "Measurement Standard"

    db.close()


def test_relationships_audit():
    """Verify exact 4 authoritative relationships without fabrication."""
    db = SessionLocal()
    relationships = db.query(StandardRelationship).all()
    assert len(relationships) == 4

    rel_tuples = []
    for r in relationships:
        src = db.query(Standard).filter(Standard.id == r.source_standard_id).first()
        tgt = db.query(Standard).filter(Standard.id == r.target_standard_id).first()
        rel_tuples.append((src.standard_number, r.relationship_type, tgt.standard_number))

    # Verify exact normative relationships
    assert ("IS 302 (Part 2/Sec 21):2024", "SUPERSEDES", "IS 302 (Part 2/Sec 21):2018") in rel_tuples
    assert ("IS 302 (Part 2/Sec 21):2024", "REFERENCES", "IS 302 (Part 1):2024") in rel_tuples
    assert ("IS 302 (Part 2/Sec 21):2024", "REFERENCES", "IS/IEC 60730 (Part 1):1999") in rel_tuples
    assert ("IS 2082:2018", "REFERENCES", "IS 302 (Part 2/Sec 21):2024") in rel_tuples

    db.close()
