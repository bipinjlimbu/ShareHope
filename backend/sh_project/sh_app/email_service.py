import logging
import threading
from django.conf import settings
from django.core.mail import send_mail

logger = logging.getLogger(__name__)


def send_email(subject, message, recipient):
    try:
        if isinstance(recipient, str):
            recipient_list = [recipient]
        else:
            recipient_list = list(recipient)

        recipient_list = [
            email.strip()
            for email in recipient_list
            if isinstance(email, str) and email.strip()
        ]

        if not recipient_list:
            logger.warning("No valid email recipient provided.")
            return

        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            recipient_list,
            fail_silently=False,
        )

    except Exception:
        logger.exception("Failed to send email to %s", recipient)


def send_in_background(subject, message, recipient):
    threading.Thread(
        target=send_email,
        args=(subject, message, recipient),
        daemon=True,
    ).start()


def welcome_email(user):
    subject = "Welcome to ShareHope"

    message = (
        f"Hello {user.first_name or user.username},\n\n"
        "Welcome to ShareHope!\n\n"
        "Thank you for joining our community. "
        "Together, we can make a positive difference.\n\n"
        "Regards,\n"
        "The ShareHope Team"
    )

    send_in_background(subject, message, user.email)


def donation_email(recipient_email, donor_name, campaign_name):
    subject = "New Donation - ShareHope"

    message = (
        "Hello,\n\n"
        f"{donor_name} has made a donation to "
        f"the campaign '{campaign_name}'.\n\n"
        "Please log in to ShareHope to view the donation details.\n\n"
        "Regards,\n"
        "The ShareHope Team"
    )

    send_in_background(subject, message, recipient_email)