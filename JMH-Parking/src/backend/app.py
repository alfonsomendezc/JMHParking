from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from dotenv import load_dotenv
from datetime import datetime
import os

load_dotenv()
# source /workspaces/JMHParking/.venv/bin/activate

app = Flask(__name__)

# CORS: allow your Vite preview URL in Gitpod (set via .gitpod.yml)
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")
CORS(app, resources={r"/*": {"origins": [FRONTEND_ORIGIN]}})

# DB URL (fallback to the Gitpod default if not set)
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg://app:app@localhost:5432/app"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)

# ------------------------------
# Models
# ------------------------------
class Parker(db.Model):
    __tablename__ = "parkers"

    id = db.Column(db.Integer, primary_key=True)
    firstName = db.Column(db.String(15), nullable=False)
    lastName = db.Column(db.String(15), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def __repr__(self):
        return f"<Parker id={self.id} name={self.firstName} {self.lastName}>"

    def to_dict(self):
        return {
            "id": self.id,
            "firstName": self.firstName,
            "lastName": self.lastName,
            "created_at": self.created_at.isoformat() + "Z"  # ISO 8601 (UTC style)
        }

# ------------------------------
# Health
# ------------------------------
@app.get("/")
def health():
    return jsonify({"status": "ok"})

# ------------------------------
# Parker routes (CRUD)
# ------------------------------
@app.get("/parkers")
def list_parkers():
    """Simple GET: list all parkers"""
    parkers = Parker.query.order_by(Parker.id.asc()).all()
    return jsonify([p.to_dict() for p in parkers]), 200

@app.post("/parkers")
def create_parker():
    data = request.get_json(silent=True) or {}
    first = (data.get("firstName") or "").strip()
    last = (data.get("lastName") or "").strip()

    if not first or not last:
        return jsonify({"error": "firstName and lastName are required"}), 400
    if len(first) > 15 or len(last) > 15:
        return jsonify({"error": "firstName/lastName must be ≤ 15 chars"}), 400

    p = Parker(firstName=first, lastName=last)
    db.session.add(p)
    db.session.commit()
    return jsonify(p.to_dict()), 201

@app.get("/parkers/<int:parker_id>")
def get_parker(parker_id):
    p = Parker.query.get_or_404(parker_id)
    return jsonify(p.to_dict()), 200

@app.put("/parkers/<int:parker_id>")
def update_parker(parker_id):
    p = Parker.query.get_or_404(parker_id)
    data = request.get_json(silent=True) or {}

    first = data.get("firstName")
    last  = data.get("lastName")
    if first is None or last is None:
        return jsonify({"error": "firstName and lastName are required"}), 400

    first = first.strip()
    last  = last.strip()
    if not first or not last:
        return jsonify({"error": "firstName/lastName cannot be empty"}), 400
    if len(first) > 15 or len(last) > 15:
        return jsonify({"error": "firstName/lastName must be ≤ 15 chars"}), 400

    p.firstName = first
    p.lastName = last
    db.session.commit()
    return jsonify(p.to_dict()), 200

@app.delete("/parkers/<int:parker_id>")
def delete_parker(parker_id):
    p = Parker.query.get_or_404(parker_id)
    db.session.delete(p)
    db.session.commit()
    return jsonify({"deleted": parker_id}), 200

# ------------------------------
# Dev helper (seed one record)
# ------------------------------
@app.post("/dev/seed")
def seed_dev():
    """Dev-only: insert one sample Parker if none exists."""
    exists = Parker.query.first()
    if exists:
        return jsonify({"message": "Already seeded", "sample": exists.to_dict()}), 200
    p = Parker(firstName="Jane", lastName="Doe")
    db.session.add(p)
    db.session.commit()
    return jsonify(p.to_dict()), 201

# ------------------------------
# Entrypoint
# ------------------------------
if __name__ == "__main__":
    from time import sleep
    sleep(1)
    with app.app_context():
        db.create_all()
    app.run(host="0.0.0.0", port=int(os.getenv("FLASK_RUN_PORT", 5001)), debug=True)
