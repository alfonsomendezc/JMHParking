from flask import Flask
from dotenv import load_dotenv

from .config import Config
from .extensions import db, migrate, cors
from .routes import register_routes

def create_app():
    load_dotenv()

    app = Flask(__name__)
    app.config.from_object(Config)

    # Build CORS allowed origins (merge FRONTEND_ORIGIN if set)
    allowed_origins = list(app.config.get("CORS_ALLOWED_ORIGINS", []))
    frontend_origin = (app.config.get("FRONTEND_ORIGIN") or "").strip()
    if frontend_origin and frontend_origin not in allowed_origins:
        allowed_origins.insert(0, frontend_origin)

    # init extensions
    from . import models
    db.init_app(app)
    migrate.init_app(app, db)

    cors.init_app(
        app,
        resources={r"/*": {"origins": allowed_origins}},
        supports_credentials=True,
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization"],
    )

    # routes
    register_routes(app)

    return app
