from app.database import SessionLocal
from app.services.recommendation_engine import get_recommendation_engine

engine = get_recommendation_engine()


def test_explicit_superseded_version_alert():
    db = SessionLocal()
    prompt = "We need a water heater according to IS 302 (Part 2/Sec 21):2018."
    res = engine.analyze(db, prompt)

    assert len(res.version_alerts) == 1
    alert = res.version_alerts[0]
    assert alert.alert_type == "NEWER_VERSION"
    assert alert.explicit_standard == "IS 302 (Part 2/Sec 21):2018"
    assert alert.superseding_standard == "IS 302 (Part 2/Sec 21):2024"
    db.close()


def test_general_requirement_no_false_version_alert():
    db = SessionLocal()
    # User did NOT mention 2018 edition, so no alert should fire
    prompt = "We need a 25 litre electric water heater."
    res = engine.analyze(db, prompt)

    assert len(res.version_alerts) == 0
    db.close()
