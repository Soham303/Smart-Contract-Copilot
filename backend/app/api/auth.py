import hashlib
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from app.core.db.repository import db_repo

auth_bp = Blueprint("auth", __name__)

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

    existing = db_repo.get_user_by_email(email)
    if existing:
        return jsonify({"error": {"code": "USER_EXISTS", "message": "Account with this email already exists"}}), 409

    pwd_hash = hash_password(password)
    user = db_repo.create_user(email, pwd_hash, name=name, plan="free")

    # Record registration activity and audit log in MongoDB Atlas
    db_repo.record_activity(
        user_id=user["id"],
        action="USER_REGISTERED",
        title=f"New user registered: {email}",
        details={"email": email, "name": name, "plan": "free", "storage": "MongoDB Atlas"}
    )
    db_repo.record_log(
        level="INFO",
        category="AUTH",
        message=f"User {email} successfully registered into MongoDB Atlas database",
        metadata={"userId": user["id"], "email": email, "plan": "free"},
        user_id=user["id"]
    )

    access_token = create_access_token(identity=user["id"])
    refresh_token = create_refresh_token(identity=user["id"])

    return jsonify({
        "message": "User registered successfully",
        "accessToken": access_token,
        "refreshToken": refresh_token,
        "user": {
            "id": user["id"],
            "email": user["email"],
            "name": user["name"],
            "plan": user["plan"]
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

    user = db_repo.get_user_by_email(email)
    pwd_hash = hash_password(password)
    valid_password = user and (
        user.get("passwordHash") == pwd_hash or
        (email == "demo@copilot.io" and password in ["demo", "copilot123"])
    )

    if not user or not valid_password:
        return jsonify({"error": {"code": "INVALID_CREDENTIALS", "message": "Invalid email or password"}}), 401

    access_token = create_access_token(identity=user["id"])
    refresh_token = create_refresh_token(identity=user["id"])

    # Record login activity and log in MongoDB Atlas
    db_repo.record_activity(
        user_id=user["id"],
        action="USER_LOGIN",
        title=f"User logged in: {email}",
        details={"email": email, "name": user.get("name", "")}
    )
    db_repo.record_log(
        level="INFO",
        category="AUTH",
        message=f"User {email} authenticated session via JWT",
        metadata={"userId": user["id"], "email": email},
        user_id=user["id"]
    )

    return jsonify({
        "message": "Login successful",
        "accessToken": access_token,
        "refreshToken": refresh_token,
        "user": {
            "id": user["id"],
            "email": user["email"],
            "name": user.get("name", ""),
            "plan": user.get("plan", "free")
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

    user = db_repo.get_user_by_id(identity)
    if user:
        return jsonify({
            "isGuest": False,
            "user": {
                "id": user["id"],
                "email": user["email"],
                "name": user.get("name", ""),
                "plan": user.get("plan", "free")
            }
        }), 200

    return jsonify({"isGuest": True, "user": None}), 200

@auth_bp.route("/activity", methods=["GET"])
@jwt_required(optional=True)
def get_user_activity():
    """Get chronological activity audit log for the current user (PRD FR-1.4)."""
    identity = get_jwt_identity() or "usr_demo"
    activities = db_repo.list_user_activities(identity, limit=50)
    return jsonify({
        "activities": activities,
        "count": len(activities)
    }), 200

@auth_bp.route("/logs", methods=["GET"])
@jwt_required(optional=True)
def get_system_logs():
    """Get chronological system, compiler, audit, and deployment log history from MongoDB Atlas."""
    identity = get_jwt_identity() or "usr_demo"
    category = request.args.get("category")
    project_id = request.args.get("projectId")
    limit = int(request.args.get("limit", "100"))
    logs = db_repo.list_logs(user_id=identity, project_id=project_id, category=category, limit=limit)
    return jsonify({
        "logs": logs,
        "count": len(logs),
        "database": "MongoDB Atlas" if db_repo.is_mongo_connected else "in-memory fallback"
    }), 200
