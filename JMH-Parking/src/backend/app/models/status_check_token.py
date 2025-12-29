from ..extensions import db
from .utils import utc_now, iso_utc
""" TO BE IMPLEMENTED IN FUTURE VERSIONS

class StatusCheckToken(db.Model):
    __tablename__ = "status_check_tokens"

    id = db.Column(db.Integer, primary_key=True)

    parker_id = db.Column(db.Integer, db.ForeignKey("parkers.id"), nullable=False)
    token_hash = db.Column(db.String(64), unique=True, nullable=False)

    created_at = db.Column(db.DateTime(timezone=True), nullable=False, default=utc_now)
    expires_at = db.Column(db.DateTime(timezone=True), nullable=False)

    active = db.Column(db.Boolean, nullable=False, default=True)
    used_at = db.Column(db.DateTime(timezone=True), nullable=True)

    parker = db.relationship("Parker", back_populates="status_tokens")

    def __repr__(self):
        return f"<StatusCheckToken id={self.id} parker_id={self.parker_id} active={self.active}>"

    def to_dict(self):
        return {
            "id": self.id,
            "parker_id": self.parker_id,
            "created_at": iso_utc(self.created_at),
            "expires_at": iso_utc(self.expires_at),
            "active": self.active,
            "used_at": iso_utc(self.used_at),
        }
"""