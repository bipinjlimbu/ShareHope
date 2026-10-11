from datetime import timedelta
from django.conf import settings
from django.contrib.auth import authenticate
from django.middleware.csrf import get_token
from rest_framework import status
from rest_framework.authentication import CSRFCheck
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from ..models import User
from ..serializers import UserSerializer


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

    if not username:
        errors['username'] = 'Username is required.'
    elif User.objects.filter(username=username).exists():
        errors['username'] = 'Username already exists.'

    if not email:
        errors['email'] = 'Email is required.'
    elif User.objects.filter(email__iexact=email).exists():
        errors['email'] = 'Email already exists.'

    if not password:
        errors['password'] = 'Password is required.'

    if password != confirm_password:
        errors['confirm_password'] = 'Passwords do not match.'

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
    return Response({'message': 'User registered successfully.'}, status=status.HTTP_201_CREATED)


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {'refresh': str(refresh), 'access': str(refresh.access_token)}


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
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
            matched_user = User.objects.get(email__iexact=login_credential)
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