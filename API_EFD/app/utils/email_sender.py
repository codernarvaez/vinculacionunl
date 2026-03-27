import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

def send_reset_code_email(email: str, code: str):
    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = os.getenv("SMTP_PORT")
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASSWORD")

    subject = "Código de recuperación - Actívate UNL"
    body = f"""
    Hola,

    Has solicitado restablecer tu contraseña en Actívate UNL.
    Tu código de verificación es: {code}

    Este código expirará en 10 minutos.

    Si no has solicitado esto, puedes ignorar este mensaje.
    """

    if not all([smtp_host, smtp_port, smtp_user, smtp_pass]):
        print("\n" + "="*50)
        print(f"MOCK EMAIL TO: {email}")
        print(f"SUBJECT: {subject}")
        print(f"BODY: {body}")
        print("="*50 + "\n")
        return

    try:
        msg = MIMEMultipart()
        msg['From'] = smtp_user
        msg['To'] = email
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP(smtp_host, int(smtp_port))
        server.starttls()
        server.login(smtp_user, smtp_pass)
        server.send_message(msg)
        server.quit()
    except Exception as e:
        print(f"Error sending email: {e}")
        print(f"CODE FOR {email}: {code}")
