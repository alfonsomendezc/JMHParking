from ..extensions import db
from .utils import utc_now, iso_utc

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)

    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

    role = db.Column(db.String(20), nullable=False, default="staff")  # admin/staff/viewer
    active = db.Column(db.Boolean, nullable=False, default=True)

    created_at = db.Column(db.DateTime(timezone=True), nullable=False, default=utc_now)

    reviewed_applications = db.relationship("Application", back_populates="reviewed_by_user")

    def __repr__(self):
        return f"<User id={self.id} username={self.username} role={self.role}>"

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "role": self.role,
            "active": self.active,
            "created_at": iso_utc(self.created_at),
        }
