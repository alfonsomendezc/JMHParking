from flask import Blueprint, jsonify, request
from ..extensions import db
from ..models.parker import Parker

bp = Blueprint("parkers", __name__, url_prefix="/parkers")
""" TO BE IMPLEMENTED IN FUTURE VERSIONS
@bp.get("")
def list_parkers():
    parkers = Parker.query.order_by(Parker.id.asc()).all()
    return jsonify([p.to_dict() for p in parkers]), 200

@bp.post("")
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

@bp.get("/<int:parker_id>")
def get_parker(parker_id):
    p = Parker.query.get_or_404(parker_id)
    return jsonify(p.to_dict()), 200

@bp.put("/<int:parker_id>")
def update_parker(parker_id):
    p = Parker.query.get_or_404(parker_id)
    data = request.get_json(silent=True) or {}

    first = data.get("firstName")
    last = data.get("lastName")

    if first is None or last is None:
        return jsonify({"error": "firstName and lastName are required"}), 400

    first = first.strip()
    last = last.strip()

    if not first or not last:
        return jsonify({"error": "firstName/lastName cannot be empty"}), 400
    if len(first) > 15 or len(last) > 15:
        return jsonify({"error": "firstName/lastName must be ≤ 15 chars"}), 400

    p.firstName = first
    p.lastName = last
    db.session.commit()
    return jsonify(p.to_dict()), 200

@bp.delete("/<int:parker_id>")
def delete_parker(parker_id):
    p = Parker.query.get_or_404(parker_id)
    db.session.delete(p)
    db.session.commit()
    return jsonify({"deleted": parker_id}), 200

"""