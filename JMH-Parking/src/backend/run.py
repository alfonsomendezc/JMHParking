import os
from app import create_app
from app.extensions import db

app = create_app()

if __name__ == "__main__":
    # If you still want auto-create tables in dev (optional)
    with app.app_context():
        db.create_all()

    port = int(os.getenv("FLASK_RUN_PORT", 5001))
    app.run(host="0.0.0.0", port=port, debug=True)
