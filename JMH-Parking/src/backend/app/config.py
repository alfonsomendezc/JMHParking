import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg://app:app@localhost:5432/app"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # CORS
    FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "").strip()

    # Keep as list; we’ll merge FRONTEND_ORIGIN in create_app()
    CORS_ALLOWED_ORIGINS = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        r"https://.*-5173\.app\.github\.dev",
        r"https://5173-.*\.gitpod\.io",
    ]
