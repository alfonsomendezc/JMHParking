# app/routes/forms.py
from flask import Blueprint, request, jsonify, send_file
from io import BytesIO
from datetime import datetime

from reportlab.lib.pagesizes import LETTER
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader

forms_bp = Blueprint("forms", __name__, url_prefix="/api/forms")


def _required(form, key):
    v = (form.get(key) or "").strip()
    if not v:
        return None, f"{key} is required"
    return v, None


def _truthy(v: str) -> bool:
    return (v or "").strip().lower() in ("true", "1", "yes", "on")


@forms_bp.post("/payroll/pdf")
def payroll_pdf():
    # ---- Parse multipart/form-data ----
    form = request.form
    files = request.files

    # Required fields
    employment_code, err = _required(form, "employmentCode")
    if err:
        return jsonify({"error": err}), 400

    first_name, err = _required(form, "firstName")
    if err:
        return jsonify({"error": err}), 400

    last_name, err = _required(form, "lastName")
    if err:
        return jsonify({"error": err}), 400

    phone, err = _required(form, "phone")
    if err:
        return jsonify({"error": err}), 400

    email, err = _required(form, "email")
    if err:
        return jsonify({"error": err}), 400

    license_plate, err = _required(form, "licensePlate")
    if err:
        return jsonify({"error": err}), 400

    badge_number, err = _required(form, "badgeNumber")
    if err:
        return jsonify({"error": err}), 400

    card_number, err = _required(form, "cardNumber")
    if err:
        return jsonify({"error": err}), 400

    # Optional / policy-driven
    shift = (form.get("shift") or "").strip()
    facility = (form.get("facility") or "").strip()
    rate = (form.get("rate") or "").strip()

    # Optional upload
    night_proof = files.get("nightProof")  # FileStorage or None

    # ---- Acknowledgement + Signature (required) ----
    acknowledge = _truthy(form.get("acknowledge"))
    if not acknowledge:
        return jsonify({"error": "acknowledge must be checked"}), 400

    signature_mode = (form.get("signatureMode") or "typed").strip().lower()
    signature_name = (form.get("signatureName") or "").strip()
    signature_image = files.get("signatureImage")  # FileStorage or None

    if signature_mode == "typed":
        if not signature_name:
            return jsonify({"error": "signatureName is required for typed signatures"}), 400
    elif signature_mode == "drawn":
        if not signature_image:
            return jsonify({"error": "signatureImage is required for drawn signatures"}), 400
    else:
        return jsonify({"error": "signatureMode must be 'typed' or 'drawn'"}), 400

    signed_at = datetime.now()
    signed_at_str = signed_at.strftime("%Y-%m-%d %H:%M:%S")

    # ---- Create PDF ----
    buf = BytesIO()
    c = canvas.Canvas(buf, pagesize=LETTER)
    w, h = LETTER

    LEFT = 40
    RIGHT = w - 40

    def draw_field_line(c, x, y, w):
        c.line(x, y - 2, x + w, y - 2)

    def draw_centered_text_over_line(c, x, y, w, text, font="Times-Roman", size=9):
        text = (text or "").strip()
        if not text:
            return

        s = size
        while s >= 6:
            tw = c.stringWidth(text, font, s)
            if tw <= w - 4:
                break
            s -= 0.5

        c.setFont(font, s)
        c.drawCentredString(x + w / 2, y, text)

    # ---- Header ----
    c.setFont("Times-Bold", 12)
    c.drawCentredString(w / 2, h - 80, "JACKSON MEMORIAL HOSPITAL")

    c.setFont("Times-Bold", 11)
    c.drawCentredString(w / 2, h - 95, "Parking Start Up Form")

    # Registration fee (bold + emphasized)
    c.setFont("Times-Bold", 9)
    c.drawCentredString(
        w / 2,
        h - 115,
        "Non-Refundable Registration Fee paid by check or money order: $10.00"
    )

    y = h - 145

    # ---- FIRST / LAST NAME ----
    c.setFont("Times-Bold", 9)
    c.drawString(LEFT, y, "FIRST NAME:")
    draw_field_line(c, LEFT + 70, y, 200)
    draw_centered_text_over_line(c, LEFT + 70, y, 200, first_name)

    c.drawString(LEFT + 290, y, "LAST NAME:")
    draw_field_line(c, LEFT + 355, y, RIGHT - (LEFT + 355))
    draw_centered_text_over_line(c, LEFT + 355, y, RIGHT - (LEFT + 355), last_name)
    y -= 18

    # ---- PHONE / EMAIL ----
    c.drawString(LEFT, y, "Phone #:")
    draw_field_line(c, LEFT + 45, y, 95)
    draw_centered_text_over_line(c, LEFT + 45, y, 95, phone)

    c.drawString(LEFT + 150, y, "Work/Cell #:")
    draw_field_line(c, LEFT + 220, y, 95)

    c.drawString(LEFT + 325, y, "E-mail")
    draw_field_line(c, LEFT + 365, y, RIGHT - (LEFT + 365))
    draw_centered_text_over_line(c, LEFT + 365, y, RIGHT - (LEFT + 365), email)
    y -= 18

    # ---- VEHICLE ----
    c.drawString(LEFT, y, "Vehicle MAKE/MODEL:")
    draw_field_line(c, LEFT + 110, y, 135)
    draw_centered_text_over_line(
        c,
        LEFT + 110,
        y,
        135,
        f"{(form.get('vehicleMake') or '').strip()} {(form.get('vehicleModel') or '').strip()}".strip(),
    )

    c.drawString(LEFT + 255, y, "COLOR:")
    draw_field_line(c, LEFT + 295, y, 85)
    draw_centered_text_over_line(c, LEFT + 295, y, 85, (form.get("vehicleColor") or "").strip())

    c.drawString(LEFT + 390, y, "TAG#")
    draw_field_line(c, LEFT + 420, y, RIGHT - (LEFT + 420))
    draw_centered_text_over_line(c, LEFT + 420, y, RIGHT - (LEFT + 420), license_plate)
    y -= 18

    # ---- ADDRESS ----
    c.drawString(LEFT, y, "BILLING Address:")
    draw_field_line(c, LEFT + 90, y, 330)
    draw_centered_text_over_line(c, LEFT + 90, y, 330, (form.get("address1") or "").strip())

    c.drawString(LEFT + 430, y, "APT. #:")
    draw_field_line(c, LEFT + 470, y, RIGHT - (LEFT + 470))
    draw_centered_text_over_line(c, LEFT + 470, y, RIGHT - (LEFT + 470), (form.get("apt") or "").strip())
    y -= 18

    # ---- CITY / STATE / ZIP ----
    c.drawString(LEFT, y, "City:")
    draw_field_line(c, LEFT + 25, y, 210)
    draw_centered_text_over_line(c, LEFT + 25, y, 210, (form.get("city") or "").strip())

    c.drawString(LEFT + 245, y, "State:")
    draw_field_line(c, LEFT + 285, y, 70)
    draw_centered_text_over_line(c, LEFT + 285, y, 70, (form.get("state") or "").strip())

    c.drawString(LEFT + 365, y, "ZIP Code:")
    draw_field_line(c, LEFT + 420, y, RIGHT - (LEFT + 420))
    draw_centered_text_over_line(c, LEFT + 420, y, RIGHT - (LEFT + 420), (form.get("zip") or "").strip())
    y -= 16

    # Divider
    c.line(LEFT, y, RIGHT, y)
    y -= 18

    # ---- AUTHORIZATION TEXT (static, matches form) ----
    c.setFont("Times-Roman", 8.5)
    c.drawString(LEFT, y, "_____ I hereby authorize The Public Health Trust to deduct the amount of $__________ from my salary on a")
    y -= 11
    c.drawString(LEFT, y, "biweekly basis. It is parker’s responsibility to notify the parking office of any changes in shift time as it could affect")
    y -= 11
    c.drawString(LEFT, y, "the biweekly deduction rate. I understand that in order to cancel my deductions I must complete the")
    y -= 11
    c.drawString(LEFT, y, "cancellation paperwork and deactivate my parking access card.")
    y -= 16

    c.drawString(LEFT, y, "_____ I agree to pay a monthly amount of $__________ for as long as I have an active account with Parking")
    y -= 11
    c.drawString(LEFT, y, "Services. It is parker’s responsibility to notify the parking office of any changes in shift time or association with")
    y -= 11
    c.drawString(LEFT, y, "Jackson Memorial Hospital as it could affect the monthly parking rate. I understand that in order to cancel my")
    y -= 11
    c.drawString(LEFT, y, "account I must complete the cancellation paperwork and deactivate my parking access card.")
    y -= 16

    # ---- SIGNATURE ----
    c.setFont("Times-Bold", 9)
    c.drawString(LEFT, y, "SIGNATURE:")
    draw_field_line(c, LEFT + 70, y, 300)

    if signature_mode == "typed":
        draw_centered_text_over_line(c, LEFT + 70, y, 300, signature_name)
    else:
        sig_img = ImageReader(BytesIO(signature_image.read()))
        c.drawImage(sig_img, LEFT + 90, y - 14, width=220, height=20, mask="auto")

    c.drawString(LEFT + 380, y, "DATE:")
    draw_field_line(c, LEFT + 415, y, RIGHT - (LEFT + 415))
    draw_centered_text_over_line(c, LEFT + 415, y, RIGHT - (LEFT + 415), signed_at_str)

    # Finish first page
    c.showPage()
    c.save()
    buf.seek(0)

    filename = f"Parking_Start_Up_{last_name}_{first_name}.pdf".replace(" ", "_")
    return send_file(
        buf,
        mimetype="application/pdf",
        as_attachment=True,
        download_name=filename,
        max_age=0,
    )