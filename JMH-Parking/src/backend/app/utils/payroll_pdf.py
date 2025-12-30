from __future__ import annotations

from datetime import datetime
from io import BytesIO
from typing import Optional, Dict, Any

from reportlab.lib.pagesizes import LETTER
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader


def generate_payroll_pdf(data: Dict[str, Any]) -> BytesIO:
    """
    Generates the payroll parking PDF and returns a BytesIO buffer positioned at start.
    Expects `data` to contain the fields used below (see forms.py where it's constructed).
    """

    # Required
    first_name: str = (data.get("firstName") or "").strip()
    last_name: str = (data.get("lastName") or "").strip()
    phone: str = (data.get("phone") or "").strip()
    email: str = (data.get("email") or "").strip()
    license_plate: str = (data.get("licensePlate") or "").strip()
    signed_at: datetime = data.get("signedAt") or datetime.now()

    # Optional vehicle/address fields
    vehicle_make: str = (data.get("vehicleMake") or "").strip()
    vehicle_model: str = (data.get("vehicleModel") or "").strip()
    vehicle_color: str = (data.get("vehicleColor") or "").strip()
    address1: str = (data.get("address1") or "").strip()
    apt: str = (data.get("apt") or "").strip()
    city: str = (data.get("city") or "").strip()
    state: str = (data.get("state") or "").strip()
    zip_code: str = (data.get("zip") or "").strip()

    # Signature
    signature_mode: str = (data.get("signatureMode") or "typed").strip().lower()
    signature_name: str = (data.get("signatureName") or "").strip()
    signature_image_bytes: Optional[bytes] = data.get("signatureImageBytes")

    signed_at_str = signed_at.strftime("%Y-%m-%d %H:%M:%S")

    # ---- Create PDF ----
    buf = BytesIO()
    c = canvas.Canvas(buf, pagesize=LETTER)
    w, h = LETTER

    LEFT = 40
    RIGHT = w - 40

    def draw_field_line(c_, x, y, width):
        c_.line(x, y - 2, x + width, y - 2)

    def draw_centered_text_over_line(c_, x, y, width, text, font="Times-Roman", size=9):
        text = (text or "").strip()
        if not text:
            return

        s = size
        while s >= 6:
            tw = c_.stringWidth(text, font, s)
            if tw <= width - 4:
                break
            s -= 0.5

        c_.setFont(font, s)
        c_.drawCentredString(x + width / 2, y, text)

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
        "Non-Refundable Registration Fee paid by check or money order: $10.00",
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
        f"{vehicle_make} {vehicle_model}".strip(),
    )

    c.drawString(LEFT + 255, y, "COLOR:")
    draw_field_line(c, LEFT + 295, y, 85)
    draw_centered_text_over_line(c, LEFT + 295, y, 85, vehicle_color)

    c.drawString(LEFT + 390, y, "TAG#")
    draw_field_line(c, LEFT + 420, y, RIGHT - (LEFT + 420))
    draw_centered_text_over_line(c, LEFT + 420, y, RIGHT - (LEFT + 420), license_plate)
    y -= 18

    # ---- ADDRESS ----
    c.drawString(LEFT, y, "BILLING Address:")
    draw_field_line(c, LEFT + 90, y, 330)
    draw_centered_text_over_line(c, LEFT + 90, y, 330, address1)

    c.drawString(LEFT + 430, y, "APT. #:")
    draw_field_line(c, LEFT + 470, y, RIGHT - (LEFT + 470))
    draw_centered_text_over_line(c, LEFT + 470, y, RIGHT - (LEFT + 470), apt)
    y -= 18

    # ---- CITY / STATE / ZIP ----
    c.drawString(LEFT, y, "City:")
    draw_field_line(c, LEFT + 25, y, 210)
    draw_centered_text_over_line(c, LEFT + 25, y, 210, city)

    c.drawString(LEFT + 245, y, "State:")
    draw_field_line(c, LEFT + 285, y, 70)
    draw_centered_text_over_line(c, LEFT + 285, y, 70, state)

    c.drawString(LEFT + 365, y, "ZIP Code:")
    draw_field_line(c, LEFT + 420, y, RIGHT - (LEFT + 420))
    draw_centered_text_over_line(c, LEFT + 420, y, RIGHT - (LEFT + 420), zip_code)
    y -= 16

    # Divider
    c.line(LEFT, y, RIGHT, y)
    y -= 18

    # ---- AUTHORIZATION TEXT (static, matches form) ----
    c.setFont("Times-Roman", 8.5)
    c.drawString(
        LEFT,
        y,
        "_____ I hereby authorize The Public Health Trust to deduct the amount of $__________ from my salary on a",
    )
    y -= 11
    c.drawString(
        LEFT,
        y,
        "biweekly basis. It is parker’s responsibility to notify the parking office of any changes in shift time as it could affect",
    )
    y -= 11
    c.drawString(
        LEFT,
        y,
        "the biweekly deduction rate. I understand that in order to cancel my deductions I must complete the",
    )
    y -= 11
    c.drawString(
        LEFT,
        y,
        "cancellation paperwork and deactivate my parking access card.",
    )
    y -= 16

    c.drawString(
        LEFT,
        y,
        "_____ I agree to pay a monthly amount of $__________ for as long as I have an active account with Parking",
    )
    y -= 11
    c.drawString(
        LEFT,
        y,
        "Services. It is parker’s responsibility to notify the parking office of any changes in shift time or association with",
    )
    y -= 11
    c.drawString(
        LEFT,
        y,
        "Jackson Memorial Hospital as it could affect the monthly parking rate. I understand that in order to cancel my",
    )
    y -= 11
    c.drawString(
        LEFT,
        y,
        "account I must complete the cancellation paperwork and deactivate my parking access card.",
    )
    y -= 16

    # ---- SIGNATURE ----
    c.setFont("Times-Bold", 9)
    c.drawString(LEFT, y, "SIGNATURE:")
    draw_field_line(c, LEFT + 70, y, 300)

    if signature_mode == "typed":
        draw_centered_text_over_line(c, LEFT + 70, y, 300, signature_name)
    else:
        if signature_image_bytes:
            sig_img = ImageReader(BytesIO(signature_image_bytes))
            c.drawImage(sig_img, LEFT + 90, y - 14, width=220, height=20, mask="auto")

    c.drawString(LEFT + 380, y, "DATE:")
    draw_field_line(c, LEFT + 415, y, RIGHT - (LEFT + 415))
    draw_centered_text_over_line(c, LEFT + 415, y, RIGHT - (LEFT + 415), signed_at_str)

    # Finish first page
    c.showPage()
    c.save()
    buf.seek(0)
    return buf


def build_payroll_filename(first_name: str, last_name: str) -> str:
    filename = f"Parking_Start_Up_{last_name}_{first_name}.pdf"
    return filename.replace(" ", "_")