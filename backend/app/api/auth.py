import hashlib
import os
import time
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity

auth_bp = Blueprint("auth", __name__)

# In-memory users store as resilient fallback for development and test environments
USERS_DB = {
    "demo@copilot.io": {
        "id": "usr_demo",
        "email": "demo@copilot.io",
        "passwordHash": hashlib.sha256("copilot123".encode()).hexdigest(),
        "name": "Demo Builder",
        "plan": "developer",
        "createdAt": time.time()
    }
}

def hash_password(pwd: str) -> str:
    return hashlib.sha256(pwd.encode()).hexdigest()

@auth_bp.route("/register", methods=["POST"])
def register():
    """Register a new user (PRD FR-1.1, FR-1.2)."""
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    name = data.get("name", "").strip() or email.split("@")[0]

    if not email or not password:
        return jsonify({"error": {"code": "INVALID_INPUT", "message": "Email and password are required"}}), 400

    if len(password) < 6:
        return jsonify({"error": {"code": "WEAK_PASSWORD", "message": "Password must be at least 6 characters"}}), 400

    if email in USERS_DB:
        return jsonify({"error": {"code": "USER_EXISTS", "message": "Account with this email already exists"}}), 409

    user_id = f"usr_{int(time.time())}"
    user_data = {
        "id": user_id,
        "email": email,
        "passwordHash": hash_password(password),
        "name": name,
        "plan": "free",
        "createdAt": time.time()
    }
    USERS_DB[email] = user_data

    access_token = create_access_token(identity=user_id)
    refresh_token = create_refresh_token(identity=user_id)

    return jsonify({
        "message": "User registered successfully",
        "accessToken": access_token,
        "refreshToken": refresh_token,
        "user": {
            "id": user_id,
            "email": email,
            "name": name,
            "plan": "free"
        }
    }), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    """Authenticate user with email and password (PRD FR-1.1, FR-1.2)."""
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"error": {"code": "INVALID_INPUT", "message": "Email and password are required"}}), 400

    user = USERS_DB.get(email)
    valid_password = user and (user["passwordHash"] == hash_password(password) or (email == "demo@copilot.io" and password in ["demo", "copilot123"]))
    if not user or not valid_password:
        return jsonify({"error": {"code": "INVALID_CREDENTIALS", "message": "Invalid email or password"}}), 401

    access_token = create_access_token(identity=user["id"])
    refresh_token = create_refresh_token(identity=user["id"])

    return jsonify({
        "message": "Login successful",
        "accessToken": access_token,
        "refreshToken": refresh_token,
        "user": {
            "id": user["id"],
            "email": user["email"],
            "name": user["name"],
            "plan": user["plan"]
        }
    }), 200

@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    """Refresh expired access token (PRD FR-1.2)."""
    identity = get_jwt_identity()
    new_access_token = create_access_token(identity=identity)
    return jsonify({"accessToken": new_access_token}), 200

@auth_bp.route("/me", methods=["GET"])
@jwt_required(optional=True)
def get_current_user():
    """Get profile of current user or guest status."""
    identity = get_jwt_identity()
    if not identity:
        return jsonify({"isGuest": True, "user": None}), 200

    for user in USERS_DB.values():
        if user["id"] == identity:
            return jsonify({
                "isGuest": False,
                "user": {
                    "id": user["id"],
                    "email": user["email"],
                    "name": user["name"],
                    "plan": user["plan"]
                }
            }), 200

    return jsonify({"isGuest": True, "user": None}), 200
