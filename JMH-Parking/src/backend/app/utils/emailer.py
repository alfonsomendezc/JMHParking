import base64
import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import (
    Mail,
    Attachment,
    FileContent,
    FileName,
    FileType,
    Disposition,
)

def send_confirmation_email_with_pdf(
    to_email: str,
    pdf_bytes: bytes,
    applicant_name: str = "",
):
    api_key = os.getenv("SENDGRID_API_KEY")
    from_email = os.getenv("MAIL_FROM")

    if not api_key or not from_email:
        raise RuntimeError("Missing SENDGRID_API_KEY or MAIL_FROM")

    subject = "JMH Parking Application Confirmation"

    html_body = f"""
    <p>Hello {applicant_name},</p>
    <p>Your parking application has been successfully submitted.</p>
    <p>Your completed application PDF is attached for your records.</p>
    <p>If you need changes, please reply to this email.</p>
    <br>
    <p>— JMH Parking</p>
    """

    message = Mail(
        from_email=from_email,
        to_emails=to_email,
        subject=subject,
        html_content=html_body,
    )

    message.plain_text_content = (
        f"Hello {applicant_name},\n\n"
        "Your parking application has been successfully submitted.\n"
        "Your completed application PDF is attached for your records.\n\n"
        "— JMH Parking"
    )

    encoded_pdf = base64.b64encode(pdf_bytes).decode("utf-8")

    attachment = Attachment(
        FileContent(encoded_pdf),
        FileName("Parking_Application.pdf"),
        FileType("application/pdf"),
        Disposition("attachment"),
    )

    message.attachment = attachment

    sg = SendGridAPIClient(api_key)
    response = sg.send(message)

    if response.status_code >= 400:
        raise RuntimeError(
            f"SendGrid error {response.status_code}: {response.body}"
        )
