from datetime import timedelta
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password, check_password
from ..models import User
from ..serializers import UserSerializer
from ..email_service import send_email
import secrets
import re

@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    if request.method == 'GET':
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    if request.method == 'PUT':
        errors = {}
        username = request.data.get('username', '')
        first_name = request.data.get('first_name', '')
        last_name = request.data.get('last_name', '')
        email = request.data.get('email', '')
        phone = request.data.get('phone', '')
        profile_picture = request.FILES.get('profile_picture', None)
        
        username_pattern = r'^[a-zA-Z0-9_]{3,30}$'
        first_name_pattern = r'^[a-zA-Z]{1,30}$'
        last_name_pattern = r'^[a-zA-Z]{1,30}$'
        email_pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
        phone_pattern = r'^\+?\d{10,15}$'
        profile_picture_pattern = r'^.*\.(jpg|jpeg|png|gif)$'
        
        if not username:
            errors['username'] = 'Username is required.'
        elif User.objects.exclude(pk=request.user.pk).filter(username=username).exists():
            errors['username'] = 'Username already exists.'
        elif not re.match(username_pattern, username):
            errors['username'] = 'Username must be 3-30 characters long and can only contain letters, numbers, and underscores.'
            
        if first_name and not re.match(first_name_pattern, first_name):
            errors['first_name'] = 'First name can only contain letters and must be 1-30 characters long.'
            
        if last_name and not re.match(last_name_pattern, last_name):
            errors['last_name'] = 'Last name can only contain letters and must be 1-30 characters long.'
            
        if not email:
            errors['email'] = 'Email is required.'
        elif User.objects.exclude(pk=request.user.pk).filter(email=email).exists():
            errors['email'] = 'Email already exists.'
        elif not re.match(email_pattern, email):
            errors['email'] = 'Invalid email format.'
            
        if phone and not re.match(phone_pattern, phone):
            errors['phone'] = 'Phone number must be 10-15 digits long and can optionally start with a +.'
            
        if profile_picture and not re.match(profile_picture_pattern, profile_picture.name):
            errors['profile_picture'] = 'Profile picture must be a valid image file (jpg, jpeg, png, gif).'
            
        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.get(pk=request.user.pk)
        user.username = username
        user.first_name = first_name
        user.last_name = last_name
        user.email = email
        user.phone = phone
        if profile_picture:
            user.profile_picture = profile_picture
        user.save()
        
        subject = "Profile Updated - ShareHope"
        message = (
            f"Hello {user.first_name or user.username},\n\n"
            "Your profile has been successfully updated.\n\n"
            "If you did not make this change, please contact our support team immediately.\n\n"
            "Regards,\n"
            "The ShareHope Team"
        )
        send_email(subject, message, user.email)
        
        return Response({"message": "Profile updated successfully", "user": UserSerializer(user).data}, status=status.HTTP_200_OK)
    
    if request.method == 'PATCH':
        otp = f"{secrets.randbelow(1000000):06d}"
        user = User.objects.get(pk=request.user.pk)
        
        if user.is_verified:
            return Response({"message": "Email is already verified."}, status=status.HTTP_400_BAD_REQUEST)
        
        hashed_otp = make_password(otp)
        user.hashed_otp = hashed_otp
        user.otp_expires_at = timezone.now() + timedelta(minutes=10)
        user.save()
        
        subject = "Verify Your Email - ShareHope"
        message = f"Your OTP for email verification is: {otp}. Please use this to verify your email address."
        send_email(subject, message, request.user.email)
        
        return Response({"message": "OTP sent for email verification."}, status=status.HTTP_200_OK)
    
    if request.method == 'DELETE':
        user = User.objects.get(pk=request.user.pk)
        email = user.email
        name = user.first_name or user.username
        
        if user.role == User.Role.ADMIN:
            return Response({"error": "Admin users cannot delete their profile."}, status=status.HTTP_403_FORBIDDEN)
        
        user.delete()
        
        subject = "Profile Deleted - ShareHope"
        message = (
            f"Hello {name},\n\n"
            "Your profile has been successfully deleted from ShareHope.\n\n"
            "If you did not request this deletion, please contact our support team immediately.\n\n"
            "Regards,\n"
            "The ShareHope Team"
        )
        send_email(subject, message, email)
        
        return Response({"message": "Profile deleted successfully"}, status=status.HTTP_200_OK)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_email_view(request):
    if request.method == 'POST':
        errors = {}
        otp = request.data.get('otp', '')
        user = User.objects.get(pk=request.user.pk)
        
        if not otp:
            errors['otp'] = 'OTP is required.'
        elif not user.hashed_otp or not check_password(otp, user.hashed_otp):
            errors['otp'] = 'Invalid OTP.'
        
        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)
        
        user.is_verified = True
        user.hashed_otp = None
        user.otp_expires_at = None
        user.save()
        
        subject = "Email Verified - ShareHope"
        message = "Your email has been successfully verified. Thank you for confirming your email address."
        send_email(subject, message, request.user.email)
        
        return Response({"message": "Email verified successfully"}, status=status.HTTP_200_OK)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def resend_otp_view(request):
    if request.method == 'POST':
        user = User.objects.get(pk=request.user.pk)
        
        if user.is_verified:
            return Response({"message": "Email is already verified."}, status=status.HTTP_400_BAD_REQUEST)
        
        otp = f"{secrets.randbelow(1000000):06d}"
        hashed_otp = make_password(otp)
        user.hashed_otp = hashed_otp
        user.otp_expires_at = timezone.now() + timedelta(minutes=10)
        user.save()
        
        subject = "Resend OTP for Email Verification - ShareHope"
        message = f"Your new OTP for email verification is: {otp}. Please use this to verify your email address."
        send_email(subject, message, request.user.email)
        
        return Response({"message": "New OTP sent for email verification."}, status=status.HTTP_200_OK)