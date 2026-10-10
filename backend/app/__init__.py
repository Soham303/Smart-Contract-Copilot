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

    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(projects_bp, url_prefix="/projects")
    app.register_blueprint(blocks_bp, url_prefix="/blocks")
    app.register_blueprint(templates_bp, url_prefix="/templates")
    app.register_blueprint(graph_bp, url_prefix="/graph")
    app.register_blueprint(generate_bp, url_prefix="/generate")
    app.register_blueprint(ai_bp, url_prefix="/ai")
    app.register_blueprint(jobs_bp, url_prefix="/jobs")
    app.register_blueprint(deploy_bp, url_prefix="/deploy")
    app.register_blueprint(concepts_bp, url_prefix="/concepts")
    app.register_blueprint(reports_bp, url_prefix="/reports")

    @app.route("/health")
    def health_check():
        return jsonify({"status": "healthy", "service": "Smart Contract Copilot API", "version": "1.0"})

    return app
