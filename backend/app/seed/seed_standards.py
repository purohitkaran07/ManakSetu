"""
Seed script for initial Indian Standards knowledge base.
Populates exact authoritative standards and strictly verified relationships.
"""
from sqlalchemy.orm import Session
from app.database import Base, engine, SessionLocal
from app.models.standard import Standard
from app.models.relationship import StandardRelationship

STANDARDS_DATA = [
    {
        "id": 1,
        "standard_number": "IS 2082:2018",
        "title": "Stationary storage type electric water heaters - Specification",
        "scope": (
            "Covers stationary storage type electric water heaters for household and similar use "
            "intended for heating water on alternating current (ac) supply, having a rated storage capacity "
            "between 3 litres and 200 litres."
        ),
        "standard_type": "Product Specification",
        "classification": "Electrical & Electronics",
        "certification_status": "Mandatory Certification (BIS Scheme-I)",
        "status": "Active",
        "year": 2018,
        "description": "Primary product specification standard for stationary storage type electric water heaters.",
        "source_reference": "BIS Product Manual for Stationary Storage Type Electric Water Heaters (IS 2082:2018) / BIS Conformity Assessment Scheme-I",
        "meta_info": {
            "capacity_range": "3L - 200L",
            "voltage_rating": "Up to 250V ac single phase",
            "committee": "Electrotechnical Department (ETD)",
            "certification_scheme": "BIS Scheme-I (Marking Fee & Product Manual)",
        },
    },
    {
        "id": 2,
        "standard_number": "IS 302 (Part 2/Sec 21):2024",
        "title": "Household and Similar Electrical Appliances-Safety Part 2 Particular Requirements Section 21 Storage Water Heaters",
        "scope": (
            "Deals with the safety of stationary storage water heaters for household and similar purposes, "
            "their rated voltage being not more than 250 V for single-phase appliances and 480 V for other appliances."
        ),
        "standard_type": "Safety Standard",
        "classification": "Electrical & Electronics",
        "certification_status": "Safety Standard",
        "status": "Active",
        "year": 2024,
        "description": "Current revised safety standard specifying electrical, thermal, and mechanical safety for storage water heaters.",
        "source_reference": "BIS Electrotechnical Department (ETD 32) / Normative Safety Reference under IS 2082:2018",
        "meta_info": {
            "section": "Part 2, Section 21",
            "voltage_limit": "250V single phase / 480V polyphase",
            "replaces_edition": "2018",
        },
    },
    {
        "id": 3,
        "standard_number": "IS 302 (Part 2/Sec 21):2018",
        "title": "Household and Similar Electrical Appliances-Safety Part 2 Particular Requirements Section 21 Storage Water Heaters",
        "scope": (
            "Superseded safety specification for stationary storage water heaters for household and similar purposes. "
            "Superseded by 2024 edition."
        ),
        "standard_type": "Safety Standard",
        "classification": "Electrical & Electronics",
        "certification_status": "Safety Standard (Superseded)",
        "status": "Superseded",
        "year": 2018,
        "description": "Previous edition of the particular safety requirements for storage water heaters. Superseded by 2024 edition.",
        "source_reference": "BIS Official Gazette / Superseded by IS 302 (Part 2/Sec 21):2024",
        "meta_info": {
            "superseded_by": "IS 302 (Part 2/Sec 21):2024",
        },
    },
    {
        "id": 4,
        "standard_number": "IS 302 (Part 1):2024",
        "title": "Household and similar electrical appliances - Safety - Part 1: General requirements",
        "scope": (
            "Deals with the safety of electrical appliances for household and similar purposes, "
            "their rated voltage being not more than 250 V for single-phase appliances and 480 V for other appliances."
        ),
        "standard_type": "Safety Standard",
        "classification": "Electrical & Electronics",
        "certification_status": "Horizontal Safety Standard",
        "status": "Active",
        "year": 2024,
        "description": "General safety requirements referenced by all Part 2 particular appliance standards.",
        "source_reference": "BIS ETD 32 Committee / General Safety Requirements for Electrical Appliances",
        "meta_info": {
            "part": "Part 1 (General)",
            "applicability": "Horizontal / General Safety",
        },
    },
    {
        "id": 5,
        "standard_number": "IS/IEC 60730 (Part 1):1999",
        "title": "Automatic Electrical Controls for Household and Similar Use - Part 1: General Requirements",
        "scope": (
            "Applies to automatic electrical controls for use in, on, or in association with equipment "
            "for household and similar use, including controls for heating, air-conditioning and similar applications."
        ),
        "standard_type": "Safety & Control Standard",
        "classification": "Electrical & Electronics",
        "certification_status": "Component Safety & Control Standard",
        "status": "Active",
        "year": 1999,
        "description": "Standard for thermostats, thermal cut-outs, and control devices incorporated into household equipment.",
        "source_reference": "BIS IEC Harmonized Series / Automatic Electrical Controls",
        "meta_info": {
            "control_type": "Automatic Electrical Controls",
        },
    },
    {
        "id": 6,
        "standard_number": "IS 16923 (Part 1):2018",
        "title": "Thermocouples Part 1 — EMF Specifications and Tolerances",
        "scope": (
            "Specifies reference functions and tolerances for letter-designated thermocouples "
            "(types R, S, B, J, T, E, K, N, C and A). Not applicable to household water heating appliances."
        ),
        "standard_type": "Measurement Standard",
        "classification": "Instruments & Sensors",
        "certification_status": "Standard",
        "status": "Active",
        "year": 2018,
        "description": "Sensor tolerance standard for industrial thermocouple EMF measurement.",
        "source_reference": "BIS Production & General Engineering Department (PGD 35)",
        "meta_info": {
            "sensor_type": "Thermocouples",
            "domain": "Temperature Measurement Instrumentation",
        },
    },
]

RELATIONSHIPS_DATA = [
    # IS 302 (Part 2/Sec 21):2024 SUPERSEDES IS 302 (Part 2/Sec 21):2018
    {
        "source_num": "IS 302 (Part 2/Sec 21):2024",
        "target_num": "IS 302 (Part 2/Sec 21):2018",
        "relationship_type": "SUPERSEDES",
    },
    # IS 302 (Part 2/Sec 21):2024 REFERENCES IS 302 (Part 1):2024
    {
        "source_num": "IS 302 (Part 2/Sec 21):2024",
        "target_num": "IS 302 (Part 1):2024",
        "relationship_type": "REFERENCES",
    },
    # IS 302 (Part 2/Sec 21):2024 REFERENCES IS/IEC 60730 (Part 1):1999
    {
        "source_num": "IS 302 (Part 2/Sec 21):2024",
        "target_num": "IS/IEC 60730 (Part 1):1999",
        "relationship_type": "REFERENCES",
    },
    # IS 2082:2018 REFERENCES IS 302 (Part 2/Sec 21):2024
    {
        "source_num": "IS 2082:2018",
        "target_num": "IS 302 (Part 2/Sec 21):2024",
        "relationship_type": "REFERENCES",
    },
]


def seed_database(db: Session = None):
    close_db = False
    if db is None:
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        close_db = True

    try:
        # Seed / Update standards
        standards_by_num = {}
        for data in STANDARDS_DATA:
            std = db.query(Standard).filter(Standard.standard_number == data["standard_number"]).first()
            if not std:
                std = Standard(**data)
                db.add(std)
                db.flush()
            else:
                # Update fields if modified
                for key, val in data.items():
                    setattr(std, key, val)
                db.flush()
            standards_by_num[std.standard_number] = std

        # Seed relationships
        for rel in RELATIONSHIPS_DATA:
            src = standards_by_num.get(rel["source_num"])
            tgt = standards_by_num.get(rel["target_num"])
            if src and tgt:
                exists = (
                    db.query(StandardRelationship)
                    .filter(
                        StandardRelationship.source_standard_id == src.id,
                        StandardRelationship.target_standard_id == tgt.id,
                        StandardRelationship.relationship_type == rel["relationship_type"],
                    )
                    .first()
                )
                if not exists:
                    rel_obj = StandardRelationship(
                        source_standard_id=src.id,
                        target_standard_id=tgt.id,
                        relationship_type=rel["relationship_type"],
                    )
                    db.add(rel_obj)

        db.commit()
    finally:
        if close_db:
            db.close()


if __name__ == "__main__":
    seed_database()
    print("Database seeded successfully.")
