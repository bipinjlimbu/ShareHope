from django.conf import settings
from django.core.mail import send_mail


def send_sharehope_email(recipient_email, subject, message):
    return send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[recipient_email],
        fail_silently=False,
    )


def send_welcome_email(user):
    subject = "Welcome to ShareHope"

    message = (
        f"Hello {user.first_name or user.username},\n\n"
        "Welcome to ShareHope!\n\n"
        "Thank you for joining our community. "
        "Together, we can make a positive difference.\n\n"
        "Regards,\n"
        "The ShareHope Team"
    )

    return send_sharehope_email(
        recipient_email=user.email,
        subject=subject,
        message=message,
    )


def send_donation_notification(recipient_email, donor_name, campaign_name):
    subject = "New Donation - ShareHope"

    message = (
        f"Hello,\n\n"
        f"{donor_name} has made a donation to "
        f"the campaign '{campaign_name}'.\n\n"
        "Please log in to ShareHope to view the donation details.\n\n"
        "Regards,\n"
        "The ShareHope Team"
    )

    return send_sharehope_email(
        recipient_email=recipient_email,
        subject=subject,
        message=message,
    )