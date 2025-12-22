from ..extensions import db
from .utils import utc_now, iso_utc

class Application(db.Model):
    __tablename__ = "applications"

    id = db.Column(db.Integer, primary_key=True)

    parker_id = db.Column(db.Integer, db.ForeignKey("parkers.id"), nullable=False)
    garage_id = db.Column(db.Integer, db.ForeignKey("garages.id"), nullable=False)

    # Snapshot fields (Option B)
    employment_category = db.Column(db.String(25), nullable=False)
    shift = db.Column(db.String(10), nullable=False)
    rate = db.Column(db.String(5), nullable=False)

    status = db.Column(db.String(20), nullable=False, default="submitted")

    created_at = db.Column(db.DateTime(timezone=True), nullable=False, default=utc_now)
    reviewed_at = db.Column(db.DateTime(timezone=True), nullable=True)

    reviewed_by_user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    notes = db.Column(db.String(255), nullable=True)

    # relationships
    parker = db.relationship("Parker", back_populates="applications")
    garage = db.relationship("Garage", back_populates="applications")
    reviewed_by_user = db.relationship("User", back_populates="reviewed_applications")

    def __repr__(self):
        return f"<Application id={self.id} parker_id={self.parker_id} status={self.status}>"

    def to_dict(self):
        return {
            "id": self.id,
            "parker_id": self.parker_id,
            "garage_id": self.garage_id,

            "employment_category": self.employment_category,
            "shift": self.shift,
            "rate": self.rate,

            "status": self.status,
            "notes": self.notes,

            "created_at": iso_utc(self.created_at),
            "reviewed_at": iso_utc(self.reviewed_at),
            "reviewed_by_user_id": self.reviewed_by_user_id,
        }
