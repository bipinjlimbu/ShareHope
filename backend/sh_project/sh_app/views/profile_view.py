from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ..models import User
from ..serializers import UserSerializer

@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    errors = {}
    if request.method == 'PUT':
        username = request.data.get('username', '')
        first_name = request.data.get('first_name', '')
        last_name = request.data.get('last_name', '')
        email = request.data.get('email', '')
        phone = request.data.get('phone', '')
        profile_picture = request.FILES.get('profile_picture', None)
        
        if not username:
            errors['username'] = 'Username is required.'
        elif User.objects.exclude(pk=request.user.pk).filter(username=username).exists():
            errors['username'] = 'Username already exists.'
            
        if not email:
            errors['email'] = 'Email is required.'
        elif User.objects.exclude(pk=request.user.pk).filter(email=email).exists():
            errors['email'] = 'Email already exists.'
            
        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)
        
        user = request.user
        user.username = username
        user.first_name = first_name
        user.last_name = last_name
        user.email = email
        user.phone = phone
        if profile_picture:
            user.profile_picture = profile_picture
        user.save()
        return Response({"message": "Profile updated successfully", "user": UserSerializer(user).data}, status=status.HTTP_200_OK)
    
    if request.method == 'DELETE':
        user = request.user
        user.delete()
        return Response({"message": "Profile deleted successfully"}, status=status.HTTP_200_OK)