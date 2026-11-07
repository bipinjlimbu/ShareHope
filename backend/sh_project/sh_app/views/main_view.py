from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from ..models import Notification, User
from ..serializers import UserSerializer
from django.core.mail import send_mail
from dotenv import load_dotenv
import secrets
import re
import os

load_dotenv()

@api_view(['POST'])
@permission_classes([AllowAny])
def contact_view(request):
    if request.method == 'POST':
        name = request.data.get('name', '')
        email = request.data.get('email', '')
        message = request.data.get('message', '')
        
        name_pattern = r'^[a-zA-Z\s]{1,100}$'
        email_pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'

        errors = {}

        if not name:
            errors['name'] = 'Name is required.'
        elif len(name) > 100:
            errors['name'] = 'Name must be less than 100 characters.'
        elif not re.match(name_pattern, name):
            errors['name'] = 'Name can only contain letters and spaces.'

        if not email:
            errors['email'] = 'Email is required.'
        elif not re.match(email_pattern, email):
            errors['email'] = 'Invalid email format.'

        if not message:
            errors['message'] = 'Message is required.'
        elif len(message) > 1000:
            errors['message'] = 'Message must be less than 1000 characters.'

        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        send_mail(
            subject=f"Contact Form Submission from {name}",
            message=message,
            from_email=email,
            recipient_list=[os.getenv('EMAIL_HOST_USER')],
            fail_silently=False,
        )
        
        notification = Notification.objects.create(
            user=User.objects.filter(is_superuser=True).first(),
            type=Notification.NotificationType.CONTACT,
            title='New Contact Form Submission',
            message=f'You have received a new message from {name} ({email}):\n\n{message}'
        )
        notification.save()
        
        return Response({'message': 'Your message has been sent successfully.'}, status=status.HTTP_200_OK)