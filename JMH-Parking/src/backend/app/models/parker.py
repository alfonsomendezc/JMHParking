from ..extensions import db
from .utils import utc_now, iso_utc
""" TO BE IMPLEMENTED IN FUTURE VERSIONS
class Parker(db.Model):
    __tablename__ = "parkers"

    id = db.Column(db.Integer, primary_key=True)

    garage_id = db.Column(db.Integer, db.ForeignKey("garages.id"), nullable=False)

    first_name = db.Column(db.String(25), nullable=False)
    last_name = db.Column(db.String(25), nullable=False)

    badge_number = db.Column(db.String(7), unique=True, nullable=True)
    lawson_number = db.Column(db.String(7), unique=True, nullable=True)
    card_number = db.Column(db.String(10), unique=True, nullable=True)

    # Current/most-recent values (Option B also snapshots these in Application)
    rate = db.Column(db.String(5), nullable=False)
    employment_category = db.Column(db.String(25), nullable=False)
    shift = db.Column(db.String(10), nullable=False)

    phone_number = db.Column(db.String(16), unique=False, nullable=True)
    email_address = db.Column(db.String(50), unique=True, nullable=True)

    vehicle_make = db.Column(db.String(25), nullable=False)
    vehicle_model = db.Column(db.String(25), nullable=False)
    vehicle_color = db.Column(db.String(25), nullable=False)
    vehicle_license_plate = db.Column(db.String(10), unique=True, nullable=False)

    address_line1 = db.Column(db.String(50), nullable=False)
    address_line2 = db.Column(db.String(50), nullable=True)
    city = db.Column(db.String(25), nullable=False)
    state = db.Column(db.String(2), nullable=False)
    zip_code = db.Column(db.String(10), nullable=False)
    country = db.Column(db.String(25), nullable=False, default="US")

    created_at = db.Column(db.DateTime(timezone=True), nullable=False, default=utc_now)
    updated_at = db.Column(db.DateTime(timezone=True), nullable=False, default=utc_now, onupdate=utc_now)

    # relationships
    garage = db.relationship("Garage", back_populates="parkers")
    applications = db.relationship("Application", back_populates="parker", cascade="all, delete-orphan")
    status_tokens = db.relationship("StatusCheckToken", back_populates="parker", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Parker id={self.id} name={self.first_name} {self.last_name}>"

    def to_dict(self):
        return {
            "id": self.id,
            "garage_id": self.garage_id,
            "first_name": self.first_name,
            "last_name": self.last_name,

            "badge_number": self.badge_number,
            "lawson_number": self.lawson_number,
            "card_number": self.card_number,

            "rate": self.rate,
            "employment_category": self.employment_category,
            "shift": self.shift,

            "phone_number": self.phone_number,
            "email_address": self.email_address,

            "vehicle_make": self.vehicle_make,
            "vehicle_model": self.vehicle_model,
            "vehicle_color": self.vehicle_color,
            "vehicle_license_plate": self.vehicle_license_plate,

            "address_line1": self.address_line1,
            "address_line2": self.address_line2,
            "city": self.city,
            "state": self.state,
            "zip_code": self.zip_code,
            "country": self.country,

            "created_at": iso_utc(self.created_at),
            "updated_at": iso_utc(self.updated_at),
        }

"""