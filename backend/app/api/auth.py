from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    """Register a new user (PRD FR-1.1)."""
    return jsonify({"message": "User registered successfully", "userId": "mock_id"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    """Authenticate user and return JWT tokens (PRD FR-1.1, FR-1.2)."""
    return jsonify({
        "accessToken": "mock_access_token",
        "refreshToken": "mock_refresh_token",
        "user": {"email": "user@example.com", "plan": "free"}
    }), 200

@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    """Refresh expired access token (PRD FR-1.2)."""
    identity = get_jwt_identity()
    new_access_token = create_access_token(identity=identity)
    return jsonify({"accessToken": new_access_token}), 200
