from flask import Flask, jsonify
from flask_cors import CORS
from app.config import Config
from app.extensions import init_extensions

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Enable CORS
    CORS(app, resources={r"/*": {"origins": "*"}})

    # Initialize extensions
    init_extensions(app)

    # Ensure MongoDB indexes are configured
    from app.core.db.repository import db_repo
    db_repo.ensure_indexes()

    # Register API Blueprints (PRD Section 15)
    from app.api.auth import auth_bp
    from app.api.projects import projects_bp
    from app.api.blocks import blocks_bp
    from app.api.templates import templates_bp
    from app.api.graph import graph_bp
    from app.api.generate import generate_bp
    from app.api.ai import ai_bp
    from app.api.jobs import jobs_bp
    from app.api.deploy import deploy_bp
    from app.api.concepts import concepts_bp
    from app.api.reports import reports_bp

    # Register API Blueprints with dual routing for backwards & PRD compliance
    blueprints = [
        (auth_bp, "auth"),
        (projects_bp, "projects"),
        (blocks_bp, "blocks"),
        (templates_bp, "templates"),
        (graph_bp, "graph"),
        (generate_bp, "generate"),
        (ai_bp, "ai"),
        (jobs_bp, "jobs"),
        (deploy_bp, "deploy"),
        (concepts_bp, "concepts"),
        (reports_bp, "reports"),
    ]

    for bp, prefix in blueprints:
        app.register_blueprint(bp, url_prefix=f"/{prefix}")
        app.register_blueprint(bp, url_prefix=f"/api/v1/{prefix}", name=f"{bp.name}_v1")


    @app.route("/health")
    def health_check():
        return jsonify({"status": "healthy", "service": "Smart Contract Copilot API", "version": "1.0"})

    return app
