from app.database import SessionLocal
from app.services.recommendation_engine import get_recommendation_engine

engine = get_recommendation_engine()


def test_water_heater_recommendations_and_candidate_separation():
    db = SessionLocal()
    prompt = "We need to procure 500 wall-mounted 25 litre electric storage water heaters for government hostels."
    res = engine.analyze(db, prompt)

    rec_numbers = [r.standard.standard_number for r in res.recommendations]
    # Primary water heater standards should be recommended
    assert "IS 2082:2018" in rec_numbers
    assert "IS 302 (Part 2/Sec 21):2024" in rec_numbers

    # IS 16923 (Thermocouple) must NOT be in primary recommendations
    assert "IS 16923 (Part 1):2018" not in rec_numbers

    # Superseded edition IS 302:2018 should not be in primary recommendations
    assert "IS 302 (Part 2/Sec 21):2018" not in rec_numbers
    # But IS 302:2018 should be preserved in candidate standards
    cand_numbers = [c.standard.standard_number for c in res.candidate_standards]
    assert "IS 302 (Part 2/Sec 21):2018" in cand_numbers

    # Certification status must be exact source-bound values
    for r in res.recommendations:
        assert r.certification_status == r.standard.certification_status
        assert r.standard.source_reference is not None

    rec_map = {r.standard.standard_number: r for r in res.recommendations}
    assert rec_map["IS 2082:2018"].certification_status == "Mandatory Certification (BIS Scheme-I)"
    assert rec_map["IS 302 (Part 2/Sec 21):2024"].certification_status == "Safety Standard"

    db.close()


def test_unrelated_product_no_fabricated_recommendation():
    db = SessionLocal()
    # Knowledge base has no cement standard
    prompt = "We need Portland cement."
    res = engine.analyze(db, prompt)

    # Must NOT invent any recommendation
    assert len(res.recommendations) == 0

    db.close()
