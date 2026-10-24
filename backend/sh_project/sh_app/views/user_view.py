from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ..models import User
from ..serializers import UserSerializer
from ..email_service import send_email

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_view(request):
    if request.method == 'GET':
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def user_detail_view(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    if request.method == 'PATCH':
        is_active = request.data.get('is_active') == 'true'
        user.is_active = is_active
        user.save()
        
        if not is_active:
            subject = 'Account Deactivation'
            message = 'Your account has been deactivated. If you believe this is a mistake, please contact support.'
            send_email(subject, message, user.email)
            
            return Response({'message': 'User account deactivated and email sent.'}, status=status.HTTP_200_OK)
        
        else:
            subject = 'Account Reactivation'
            message = 'Your account has been reactivated. Welcome back!'
            send_email(subject, message, user.email)
            
            return Response({'message': 'User account reactivated and email sent.'}, status=status.HTTP_200_OK)
        
    if request.method == 'DELETE':
        email = user.email
        user.delete()
        
        subject = 'Account Deletion'
        message = 'Your account has been deleted. We are sorry to see you go.'
        send_email(subject, message, email)
        
        return Response({'message': 'User deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)