from __future__ import annotations

from datetime import datetime
from flask import Blueprint, request, jsonify, send_file

from app.utils.payroll_pdf import generate_payroll_pdf, build_payroll_filename

# If you already created this helper earlier:
# from app.utils.emailer import send_confirmation_email_with_pdf
from app.utils.emailer import send_confirmation_email_with_pdf  # adjust path if different

forms_bp = Blueprint("forms", __name__, url_prefix="/api/forms")


def _required(form, key):
    v = (form.get(key) or "").strip()
    if not v:
        return None, f"{key} is required"
    return v, None


def _truthy(v: str) -> bool:
    return (v or "").strip().lower() in ("true", "1", "yes", "on")


def _parse_and_validate_payload():
    """
    Parses multipart/form-data from request and returns (data_dict, filename) or (error_response, None)
    """
    form = request.form
    files = request.files

    # Required fields
    employment_code, err = _required(form, "employmentCode")
    if err:
        return jsonify({"error": err}), None

    first_name, err = _required(form, "firstName")
    if err:
        return jsonify({"error": err}), None

    last_name, err = _required(form, "lastName")
    if err:
        return jsonify({"error": err}), None

    phone, err = _required(form, "phone")
    if err:
        return jsonify({"error": err}), None

    email, err = _required(form, "email")
    if err:
        return jsonify({"error": err}), None

    license_plate, err = _required(form, "licensePlate")
    if err:
        return jsonify({"error": err}), None

    badge_number, err = _required(form, "badgeNumber")
    if err:
        return jsonify({"error": err}), None

    card_number, err = _required(form, "cardNumber")
    if err:
        return jsonify({"error": err}), None

    # Optional / policy-driven (kept for future; not drawn on PDF currently)
    shift = (form.get("shift") or "").strip()
    facility = (form.get("facility") or "").strip()
    rate = (form.get("rate") or "").strip()

    # Optional upload
    night_proof = files.get("nightProof")  # FileStorage or None (not used in PDF currently)

    # ---- Acknowledgement + Signature (required) ----
    acknowledge = _truthy(form.get("acknowledge"))
    if not acknowledge:
        return jsonify({"error": "acknowledge must be checked"}), None

    signature_mode = (form.get("signatureMode") or "typed").strip().lower()
    signature_name = (form.get("signatureName") or "").strip()
    signature_image = files.get("signatureImage")  # FileStorage or None

    signature_image_bytes = None
    if signature_mode == "typed":
        if not signature_name:
            return jsonify({"error": "signatureName is required for typed signatures"}), None
    elif signature_mode == "drawn":
        if not signature_image:
            return jsonify({"error": "signatureImage is required for drawn signatures"}), None
        # IMPORTANT: read bytes once here (FileStorage stream gets consumed)
        signature_image_bytes = signature_image.read()
        if not signature_image_bytes:
            return jsonify({"error": "signatureImage was empty"}), None
    else:
        return jsonify({"error": "signatureMode must be 'typed' or 'drawn'"}), None

    signed_at = datetime.now()

    data = {
        # required
        "employmentCode": employment_code,
        "firstName": first_name,
        "lastName": last_name,
        "phone": phone,
        "email": email,
        "licensePlate": license_plate,
        "badgeNumber": badge_number,
        "cardNumber": card_number,
        # optional/policy
        "shift": shift,
        "facility": facility,
        "rate": rate,
        # optional vehicle/address
        "vehicleMake": (form.get("vehicleMake") or "").strip(),
        "vehicleModel": (form.get("vehicleModel") or "").strip(),
        "vehicleColor": (form.get("vehicleColor") or "").strip(),
        "address1": (form.get("address1") or "").strip(),
        "apt": (form.get("apt") or "").strip(),
        "city": (form.get("city") or "").strip(),
        "state": (form.get("state") or "").strip(),
        "zip": (form.get("zip") or "").strip(),
        # signature
        "acknowledge": acknowledge,
        "signatureMode": signature_mode,
        "signatureName": signature_name,
        "signatureImageBytes": signature_image_bytes,
        "signedAt": signed_at,
        # (kept for future)
        "nightProofProvided": bool(night_proof),
    }

    filename = build_payroll_filename(first_name=first_name, last_name=last_name)
    return data, filename


@forms_bp.post("/payroll/pdf")
def payroll_pdf():
    """
    Returns the PDF as a download (your existing behavior).
    No DB storage.
    """
    parsed, filename = _parse_and_validate_payload()
    if filename is None:
        # parsed is already a Flask response from jsonify(...)
        return parsed, 400

    data = parsed
    buf = generate_payroll_pdf(data)

    return send_file(
        buf,
        mimetype="application/pdf",
        as_attachment=True,
        download_name=filename,
        max_age=0,
    )


@forms_bp.post("/payroll/submit")
def payroll_submit():
    """
    Sends a confirmation email with the PDF attached.
    Returns JSON only.
    No DB storage.
    """
    parsed, filename = _parse_and_validate_payload()
    if filename is None:
        return parsed, 400

    data = parsed
    buf = generate_payroll_pdf(data)
    pdf_bytes = buf.getvalue()

    try:
        send_confirmation_email_with_pdf(
            to_email=data["email"],
            pdf_bytes=pdf_bytes,
            applicant_name=f"{data.get('firstName','').strip()} {data.get('lastName','').strip()}".strip(),
        )
    except Exception as e:
        # Don't leak internal errors; log server-side if you have logging set up
        return jsonify({"error": "Failed to send confirmation email."}), 502

    return jsonify({"ok": True, "filename": filename}), 200