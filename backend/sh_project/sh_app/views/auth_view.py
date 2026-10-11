from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from ..models import User

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    errors = {}
    if request.method == 'POST':
        username = request.data.get('username')
        first_name = request.data.get('first_name','')
        last_name = request.data.get('last_name','')
        email = request.data.get('email')
        password = request.data.get('password')
        confirm_password = request.data.get('confirm_password')
        role = request.data.get('role', User.Role.DONOR)
        phone = request.data.get('phone','')
        profile_picture = request.FILES.get('profile_picture', None)
        
        if not username:
            errors['username'] = 'Username is required.'
        elif User.objects.filter(username=username).exists():
            errors['username'] = 'Username already exists.'
            
        if not email:
            errors['email'] = 'Email is required.'
        elif User.objects.filter(email=email).exists():
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