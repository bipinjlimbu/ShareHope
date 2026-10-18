from datetime import timedelta
from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password, check_password
from django.middleware.csrf import get_token
from rest_framework import status
from rest_framework.authentication import CSRFCheck
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils import timezone
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from ..email_service import send_email, welcome_email
from ..models import User
from ..serializers import UserSerializer
import secrets
import re

def set_auth_cookies(response, access_token, refresh_token=None):
    secure_cookie = not settings.DEBUG
    access_lifetime = settings.SIMPLE_JWT.get('ACCESS_TOKEN_LIFETIME', timedelta(minutes=5))
    refresh_lifetime = settings.SIMPLE_JWT.get('REFRESH_TOKEN_LIFETIME', timedelta(days=1))

    response.set_cookie(key='access_token', value=access_token, httponly=True, secure=secure_cookie, samesite='Lax', max_age=int(access_lifetime.total_seconds()), path='/')

    if refresh_token is not None:
        response.set_cookie(key='refresh_token', value=refresh_token, httponly=True, secure=secure_cookie, samesite='Lax', max_age=int(refresh_lifetime.total_seconds()), path='/')


def set_csrf_cookie(request, response):
    csrf_token = get_token(request._request)
    response.set_cookie(key='csrftoken', value=csrf_token, httponly=False, secure=not settings.DEBUG, samesite='Lax', path='/')


def enforce_csrf(request):
    def dummy_get_response(django_request):
        return None

    django_request = request._request
    check = CSRFCheck(dummy_get_response)
    check.process_request(django_request)
    reason = check.process_view(django_request, None, (), {})

    if reason:
        raise PermissionDenied(f'CSRF Failed: {reason}')


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    errors = {}
    username = request.data.get('username')
    first_name = request.data.get('first_name', '')
    last_name = request.data.get('last_name', '')
    email = request.data.get('email')
    password = request.data.get('password')
    confirm_password = request.data.get('confirm_password')
    role = request.data.get('role', User.Role.DONOR)
    phone = request.data.get('phone', '')
    profile_picture = request.FILES.get('profile_picture', None)
    
    username_pattern = r'^[a-zA-Z0-9_]{3,30}$'
    first_name_pattern = r'^[a-zA-Z]{1,30}$'
    last_name_pattern = r'^[a-zA-Z]{1,30}$'
    email_pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    password_pattern = r'^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$'
    phone_pattern = r'^\+?\d{10,15}$'
    profile_picture_pattern = r'^.*\.(jpg|jpeg|png|gif)$'

    if not username:
        errors['username'] = 'Username is required.'
    elif User.objects.filter(username=username).exists():
        errors['username'] = 'Username already exists.'
    elif not re.match(username_pattern, username):
        errors['username'] = 'Username must be 3-30 characters long and can only contain letters, numbers, and underscores.'
        
    if first_name and not re.match(first_name_pattern, first_name):
        errors['first_name'] = 'First name can only contain letters and must be 1-30 characters long.'

    if last_name and not re.match(last_name_pattern, last_name):
        errors['last_name'] = 'Last name can only contain letters and must be 1-30 characters long.'

    if not email:
        errors['email'] = 'Email is required.'
    elif User.objects.filter(email__iexact=email).exists():
        errors['email'] = 'Email already exists.'
    elif not re.match(email_pattern, email):
        errors['email'] = 'Invalid email format.'
        
    if not password:
        errors['password'] = 'Password is required.'
    elif not re.match(password_pattern, password):
        errors['password'] = 'Password must be at least 8 characters long, contain at least one letter, one number, and one special character.'

    if password != confirm_password:
        errors['confirm_password'] = 'Passwords do not match.'
        
    if phone and not re.match(phone_pattern, phone):
        errors['phone'] = 'Phone number must be 10-15 digits long and can optionally start with a +.'
        
    if profile_picture and not re.match(profile_picture_pattern, profile_picture.name):
        errors['profile_picture'] = 'Profile picture must be a valid image file (jpg, jpeg, png, gif).'

    if errors:
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(
        username=username, 
        first_name=first_name, 
        last_name=last_name, 
        email=email, 
        password=password, 
        role=role, 
        phone=phone, 
        profile_picture=profile_picture
    )
    user.save()
    welcome_email(user)
    return Response({'message': 'User registered successfully.'}, status=status.HTTP_201_CREATED)


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {'refresh': str(refresh), 'access': str(refresh.access_token)}

@api_view(['POST','PUT','PATCH'])
@permission_classes([AllowAny])
def login_view(request):
    if request.method == 'POST':
        errors = {}
        login_credential = request.data.get('login_credential')
        password = request.data.get('password')

        if not login_credential:
            errors['login_credential'] = 'Username or email is required.'
        if not password:
            errors['password'] = 'Password is required.'

        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, username=login_credential, password=password)

        if user is None:
            try:
                matched_user = User.objects.get(email=login_credential)
                user = authenticate(request, username=matched_user.username, password=password)
            except User.DoesNotExist:
                user = None

        if user is None:
            return Response({'error': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

        tokens = get_tokens_for_user(user)
        response = Response({'message': 'Login successful.', 'user': UserSerializer(user).data}, status=status.HTTP_200_OK)

        set_auth_cookies(response, access_token=tokens['access'], refresh_token=tokens['refresh'])
        set_csrf_cookie(request, response)

        return response
    
    if request.method == 'PATCH':
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        otp = f"{secrets.randbelow(1000000):06d}"
        user = User.objects.filter(email=email).first()
        if not user:
            return Response({'error': 'User with this email does not exist.'}, status=status.HTTP_404_NOT_FOUND)

        hashed_otp = make_password(otp)
        user.hashed_otp = hashed_otp
        user.otp_expires_at = timezone.now() + timedelta(minutes=10)
        user.save()
        
        subject = "Reset Your Password - ShareHope"
        message = f"Your OTP for password reset is: {otp}. Please use this to reset your password. This OTP will expire in 10 minutes."
        send_email(subject, message, email)
        
        return Response({"message": "OTP sent for password reset."}, status=status.HTTP_200_OK)
    
    if request.method == 'PUT':
        errors = {}
        email = request.data.get('email')
        
        user = User.objects.filter(email=email).first()
        if not user:
            return Response({'error': 'User with this email does not exist.'}, status=status.HTTP_404_NOT_FOUND)
                
        new_password = request.data.get('new_password')
        confirm_password = request.data.get('confirm_password')
        
        password_pattern = r'^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$'
        
        if not password:
            errors['new_password'] = 'New password is required.'
        elif not re.match(password_pattern, new_password):
            errors['new_password'] = 'Password must be at least 8 characters long, contain at least one letter, one number, and one special character.'
            
        if not confirm_password:
            errors['confirm_password'] = 'Confirm password is required.'
        elif new_password != confirm_password:
            errors['confirm_password'] = 'Passwords do not match.'

        if errors:
            return Response({'errors': errors}, status=status.HTTP_400_BAD_REQUEST)
        
        user.set_password(new_password)
        user.save()
        
        subject = "Password Reset Successful - ShareHope"
        message = (
            f"Hello {user.first_name or user.username},\n\n"
            "Your password has been successfully reset.\n\n"
            "If you did not make this change, please contact our support team immediately.\n\n"
            "Regards,\n"
            "The ShareHope Team"
        )
        send_email(subject, message, user.email)
        return Response({"message": "Password reset successfully."}, status=status.HTTP_200_OK)
    
@api_view(['POST'])
@permission_classes([AllowAny])
def refresh_token_view(request):
    enforce_csrf(request)
    raw_refresh_token = request.COOKIES.get('refresh_token')

    if not raw_refresh_token:
        response = Response({'error': 'Refresh token is missing. Please log in again.'}, status=status.HTTP_401_UNAUTHORIZED)
        response.delete_cookie('access_token', path='/')
        response.delete_cookie('refresh_token', path='/')
        return response

    serializer = TokenRefreshSerializer(data={'refresh': raw_refresh_token})

    try:
        serializer.is_valid(raise_exception=True)
    except (InvalidToken, TokenError):
        response = Response({'error': 'Session expired. Please log in again.'}, status=status.HTTP_401_UNAUTHORIZED)
        response.delete_cookie('access_token', path='/')
        response.delete_cookie('refresh_token', path='/')
        return response

    token_data = serializer.validated_data
    response = Response({'message': 'Session refreshed.'}, status=status.HTTP_200_OK)
    set_auth_cookies(response, access_token=token_data['access'], refresh_token=token_data.get('refresh'))
    set_csrf_cookie(request, response)

    return response

@api_view(['POST'])
@permission_classes([AllowAny])
def logout_view(request):
    enforce_csrf(request)
    response = Response({'message': 'Logged out successfully.'}, status=status.HTTP_200_OK)
    response.delete_cookie('access_token', path='/')
    response.delete_cookie('refresh_token', path='/')
    response.delete_cookie('csrftoken', path='/')
    return response

@ensure_csrf_cookie
@api_view(['GET'])
@permission_classes([AllowAny])
def csrf_token_view(request):
    return Response({'message': 'CSRF cookie set.'}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp_view(request):
    if request.method == 'POST':
        otp = request.data.get('otp', '')
        email = request.data.get('email', '')
        user = User.objects.filter(email=email).first()
        if not user:
            return Response({'error': 'User with this email does not exist.'}, status=status.HTTP_404_NOT_FOUND)
        
        if not otp:
            return Response({'error': 'OTP is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        if user.otp_expires_at and timezone.now() > user.otp_expires_at:
            return Response({'error': 'OTP has expired.'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not user.hashed_otp or not check_password(otp, user.hashed_otp):
            return Response({'error': 'Invalid OTP.'}, status=status.HTTP_400_BAD_REQUEST)
        
        user.hashed_otp = None
        user.otp_expires_at = None
        user.save()
        
        subject = "OTP Verified - ShareHope"
        message = (
            f"Hello {user.first_name or user.username},\n\n"
            "Your OTP has been successfully verified. You can now proceed to reset your password.\n\n"
            "If you did not request this, please contact our support team immediately.\n\n"
            "Regards,\n"
            "The ShareHope Team"
        )
        send_email(subject, message, email)
        
        return Response({"message": "OTP verified successfully."}, status=status.HTTP_200_OK)