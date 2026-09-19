from app.ai.requirement_analyzer import DeterministicRequirementAnalyzer

analyzer = DeterministicRequirementAnalyzer()


def test_detailed_water_heater_extraction():
    prompt = "We need to procure 500 wall-mounted 25 litre electric storage water heaters for government hostels."
    res = analyzer.analyze(prompt)
    assert res.product == "Electric Storage Water Heater"
    assert res.quantity == 500
    assert res.specifications.get("capacity") == "25 litre"
    assert res.installation == "wall-mounted"
    assert res.application == "government hostels"
    assert res.procurement_context == "government procurement"
    assert "product_category" in res.inferred_fields
    assert res.explicitly_mentioned_standards == []


def test_minimal_requirement_no_fabrication():
    prompt = "Need water heaters."
    res = analyzer.analyze(prompt)
    assert res.product == "Water Heater"
    assert res.quantity is None
    assert res.specifications == {}
    assert res.installation is None
    assert res.application is None
    assert res.procurement_context is None
    assert res.explicitly_mentioned_standards == []


def test_explicit_standard_extraction():
    prompt = "We need a water heater according to IS 302 (Part 2/Sec 21):2018."
    res = analyzer.analyze(prompt)
    assert "IS 302 (Part 2/Sec 21):2018" in res.explicitly_mentioned_standards
    # Verifies it was NOT converted to 2024
    assert not any("2024" in std for std in res.explicitly_mentioned_standards)
