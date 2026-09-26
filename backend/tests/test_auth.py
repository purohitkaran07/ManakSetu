import uuid
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app.models.user import User
from app.core.security import verify_password

client = TestClient(app)


@pytest.fixture
def unique_email():
    return f"testuser_{uuid.uuid4().hex[:8]}@example.gov.in"


def test_auth_signup_success(unique_email):
    payload = {
        "full_name": "Karan Purohit",
        "email": unique_email,
        "password": "SecurePassword123!",
    }
    response = client.post("/api/auth/signup", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert "user" in data
    assert data["user"]["full_name"] == "Karan Purohit"
    assert data["user"]["email"] == unique_email.lower()
    assert "password" not in data["user"]
    assert "password_hash" not in data["user"]

    # Verify directly in DB that password is hashed with bcrypt and not stored plain
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == unique_email.lower()).first()
        assert user is not None
        assert user.password_hash != "SecurePassword123!"
        assert user.password_hash.startswith("$2b$") or user.password_hash.startswith("$2a$")
        assert verify_password("SecurePassword123!", user.password_hash) is True
    finally:
        db.close()


def test_auth_signup_duplicate_email(unique_email):
    payload = {
        "full_name": "Officer Test",
        "email": unique_email,
        "password": "Password1234!",
    }
    # First registration
    res1 = client.post("/api/auth/signup", json=payload)
    assert res1.status_code == 201

    # Second registration with same email
    res2 = client.post("/api/auth/signup", json=payload)
    assert res2.status_code == 400
    assert "already exists" in res2.json()["detail"].lower()


def test_auth_signup_validation_errors():
    # Weak password (< 8 chars)
    res_weak = client.post(
        "/api/auth/signup",
        json={"full_name": "User", "email": "valid@email.com", "password": "123"},
    )
    assert res_weak.status_code == 422 or res_weak.status_code == 400

    # Invalid email
    res_bad_email = client.post(
        "/api/auth/signup",
        json={"full_name": "User", "email": "not-an-email", "password": "Password1234!"},
    )
    assert res_bad_email.status_code == 422 or res_bad_email.status_code == 400

    # Blank name
    res_blank_name = client.post(
        "/api/auth/signup",
        json={"full_name": " ", "email": "valid@email.com", "password": "Password1234!"},
    )
    assert res_blank_name.status_code == 422 or res_blank_name.status_code == 400


def test_auth_login_success(unique_email):
    # Register first
    signup_payload = {
        "full_name": "Procurement Officer",
        "email": unique_email,
        "password": "MySecretPassword99!",
    }
    client.post("/api/auth/signup", json=signup_payload)

    # Login with exact credentials
    login_payload = {
        "email": unique_email,
        "password": "MySecretPassword99!",
    }
    response = client.post("/api/auth/login", json=login_payload)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == unique_email.lower()
    assert "password" not in data["user"]


def test_auth_login_invalid_credentials(unique_email):
    # Register first
    signup_payload = {
        "full_name": "Valid User",
        "email": unique_email,
        "password": "CorrectPassword123!",
    }
    client.post("/api/auth/signup", json=signup_payload)

    # 1. Wrong password
    wrong_pwd_res = client.post(
        "/api/auth/login",
        json={"email": unique_email, "password": "WrongPassword999!"},
    )
    assert wrong_pwd_res.status_code == 401
    assert "invalid email or password" in wrong_pwd_res.json()["detail"].lower()

    # 2. Non-existent email
    non_existent_res = client.post(
        "/api/auth/login",
        json={"email": "nonexistent_officer@gov.in", "password": "AnyPassword123!"},
    )
    assert non_existent_res.status_code == 401
    assert "invalid email or password" in non_existent_res.json()["detail"].lower()


def test_auth_me_endpoint(unique_email):
    # Register
    signup_res = client.post(
        "/api/auth/signup",
        json={
            "full_name": "Director General",
            "email": unique_email,
            "password": "DirectorPassword123!",
        },
    )
    token = signup_res.json()["access_token"]

    # Valid token
    me_res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    me_data = me_res.json()
    assert me_data["email"] == unique_email.lower()
    assert me_data["full_name"] == "Director General"

    # Missing token
    unauth_res = client.get("/api/auth/me")
    assert unauth_res.status_code == 401

    # Malformed token
    bad_token_res = client.get("/api/auth/me", headers={"Authorization": "Bearer invalid.jwt.token"})
    assert bad_token_res.status_code == 401


def test_auth_logout_endpoint():
    res = client.post("/api/auth/logout")
    assert res.status_code == 200
    assert "logged out" in res.json()["message"].lower()
