"""
Requirement Analyzer for ManakSetu.
Provides:
- BaseRequirementAnalyzer
- DeterministicRequirementAnalyzer (rule & pattern based entity extraction)
- LLMRequirementAnalyzer (optional LLM provider, default LLM_PROVIDER=none)
"""
import re
from abc import ABC, abstractmethod
from typing import Optional, List, Dict, Any
from app.schemas.requirement import StructuredRequirement


class BaseRequirementAnalyzer(ABC):
    @abstractmethod
    def analyze(self, text: str) -> StructuredRequirement:
        pass


class DeterministicRequirementAnalyzer(BaseRequirementAnalyzer):
    """
    Deterministic rule and pattern-based requirement analyzer.
    Accurately extracts entities and distinguishes explicit vs inferred fields.
    Never fabricates values that are not present in the input text.
    """

    # Regex to capture exact Indian Standards (e.g. "IS 2082:2018", "IS 302 (Part 2/Sec 21):2024", "IS/IEC 60730 (Part 1):1999")
    STANDARD_PATTERN = re.compile(
        r"\b(IS(?:/IEC)?\s+\d+(?:\s*\([^)]+\))*(?::\d{4})?)\b",
        re.IGNORECASE,
    )

    # Quantity patterns (e.g., "500 units", "procure 500", "500 nos", "quantity: 100")
    QUANTITY_PATTERNS = [
        re.compile(r"\b(?:procure|supply|order|purchase|need|buy|quantity[:\s]*)\s+(\d+)\b", re.IGNORECASE),
        re.compile(r"\b(\d+)\s*(?:nos|units|pieces|pcs|heaters|items)\b", re.IGNORECASE),
    ]

    # Capacity / Specification patterns (e.g., "25 litre", "25L", "15 litres", "2000 W", "2 kW")
    CAPACITY_PATTERNS = [
        re.compile(r"\b(\d+(?:\.\d+)?)\s*(?:litres?|liters?|ltrs?|l)\b", re.IGNORECASE),
        re.compile(r"\b(\d+(?:\.\d+)?)\s*(?:kw|watts?|w)\b", re.IGNORECASE),
        re.compile(r"\b(\d+(?:\.\d+)?)\s*(?:v|volts?)\b", re.IGNORECASE),
    ]

    # Installation patterns
    INSTALLATION_KEYWORDS = {
        "wall-mounted": "wall-mounted",
        "wall mounted": "wall-mounted",
        "floor-standing": "floor-standing",
        "floor standing": "floor-standing",
        "ceiling-mounted": "ceiling-mounted",
        "under-sink": "under-sink",
        "horizontal": "horizontal",
        "vertical": "vertical",
    }

    # Application patterns
    APPLICATION_KEYWORDS = {
        "government hostel": "government hostels",
        "hostel": "hostels",
        "hospital": "hospitals",
        "hotel": "hotels",
        "residential": "residential",
        "domestic": "domestic / household",
        "commercial": "commercial",
        "school": "schools",
        "office": "offices",
        "barracks": "barracks",
    }

    # Procurement Context keywords
    PROCUREMENT_KEYWORDS = {
        "government": "government procurement",
        "tender": "public tender / procurement",
        "procure": "institutional procurement",
        "gem": "GeM portal procurement",
        "bid": "bidding / public procurement",
        "supply": "supply contract",
    }

    # Product taxonomy detection
    PRODUCT_PATTERNS = [
        (
            re.compile(r"\b(?:electric\s+)?storage\s+(?:type\s+)?(?:electric\s+)?water\s+heaters?\b", re.IGNORECASE),
            "Electric Storage Water Heater",
            "Household and Similar Electrical Appliances",
        ),
        (
            re.compile(r"\b(?:instant(?:aneous)?\s+)?water\s+heaters?\b", re.IGNORECASE),
            "Water Heater",
            "Household and Similar Electrical Appliances",
        ),
        (
            re.compile(r"\bgeysers?\b", re.IGNORECASE),
            "Water Heater (Geyser)",
            "Household and Similar Electrical Appliances",
        ),
        (
            re.compile(r"\b(?:portland\s+)?cement\b", re.IGNORECASE),
            "Portland Cement",
            "Civil Engineering Materials",
        ),
        (
            re.compile(r"\bthermocouples?\b", re.IGNORECASE),
            "Thermocouple",
            "Instruments and Sensors",
        ),
        (
            re.compile(r"\bair\s+conditioners?\b", re.IGNORECASE),
            "Air Conditioner",
            "Refrigeration and Air Conditioning",
        ),
        (
            re.compile(r"\brefrigerators?\b", re.IGNORECASE),
            "Refrigerator",
            "Refrigeration and Air Conditioning",
        ),
        (
            re.compile(r"\btransformers?\b", re.IGNORECASE),
            "Transformer",
            "Power Distribution & Electrical Equipment",
        ),
    ]

    def extract_explicit_standards(self, text: str) -> List[str]:
        """Extract explicit standard references (verbatim)."""
        matches = self.STANDARD_PATTERN.findall(text)
        cleaned = []
        for m in matches:
            # Normalize whitespace within standard number while preserving exact year/part
            norm = " ".join(m.split())
            if norm not in cleaned:
                cleaned.append(norm)
        return cleaned

    def analyze(self, text: str) -> StructuredRequirement:
        text_clean = text.strip()
        inferred_fields = []
        specifications: Dict[str, Any] = {}

        # 1. Explicit standards
        explicit_standards = self.extract_explicit_standards(text_clean)

        # 2. Product & Category
        detected_product = None
        detected_category = None
        for pattern, prod_name, cat_name in self.PRODUCT_PATTERNS:
            if pattern.search(text_clean):
                detected_product = prod_name
                detected_category = cat_name
                break

        # If product was recognized from pattern, mark category as inferred from product domain
        if detected_product and detected_category:
            inferred_fields.append("product_category")

        # 3. Quantity
        quantity = None
        for q_pat in self.QUANTITY_PATTERNS:
            match = q_pat.search(text_clean)
            if match:
                try:
                    quantity = int(match.group(1))
                    break
                except ValueError:
                    pass

        # 4. Specifications (Capacity, Rating)
        for cap_pat in self.CAPACITY_PATTERNS:
            match = cap_pat.search(text_clean)
            if match:
                matched_str = match.group(0).lower()
                if "l" in matched_str or "litre" in matched_str or "liter" in matched_str:
                    specifications["capacity"] = matched_str
                elif "w" in matched_str or "kw" in matched_str:
                    specifications["rated_power"] = matched_str
                elif "v" in matched_str or "volt" in matched_str:
                    specifications["rated_voltage"] = matched_str

        # 5. Installation
        installation = None
        text_lower = text_clean.lower()
        for kw, val in self.INSTALLATION_KEYWORDS.items():
            if kw in text_lower:
                installation = val
                break

        # 6. Application
        application = None
        for kw, val in self.APPLICATION_KEYWORDS.items():
            if kw in text_lower:
                application = val
                break

        # 7. Procurement context
        procurement_context = None
        for kw, val in self.PROCUREMENT_KEYWORDS.items():
            if kw in text_lower:
                procurement_context = val
                break

        return StructuredRequirement(
            product=detected_product,
            product_category=detected_category,
            quantity=quantity,
            specifications=specifications,
            application=application,
            installation=installation,
            procurement_context=procurement_context,
            explicitly_mentioned_standards=explicit_standards,
            inferred_fields=inferred_fields,
        )


class LLMRequirementAnalyzer(BaseRequirementAnalyzer):
    """
    LLM Requirement Analyzer with optional provider integration.
    Falls back to DeterministicRequirementAnalyzer if provider is 'none' or unavailable.
    """

    def __init__(self, provider: str = "none"):
        self.provider = (provider or "none").lower()
        self.fallback = DeterministicRequirementAnalyzer()

    def analyze(self, text: str) -> StructuredRequirement:
        if self.provider == "none":
            return self.fallback.analyze(text)

        # For external providers (if configured in future), fall back safely to deterministic
        return self.fallback.analyze(text)


def get_requirement_analyzer(provider: str = "none") -> BaseRequirementAnalyzer:
    if provider and provider.lower() != "none":
        return LLMRequirementAnalyzer(provider=provider)
    return DeterministicRequirementAnalyzer()
