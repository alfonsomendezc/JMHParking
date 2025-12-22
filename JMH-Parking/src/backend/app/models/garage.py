from ..extensions import db

class Garage(db.Model):
    __tablename__ = "garages"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    address = db.Column(db.String(100), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)

    # relationships
    parkers = db.relationship("Parker", back_populates="garage")
    applications = db.relationship("Application", back_populates="garage", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Garage id={self.id} name={self.name}>"

    def to_dict(self):
        return {"id": self.id, "name": self.name, "address": self.address, "capacity": self.capacity}
