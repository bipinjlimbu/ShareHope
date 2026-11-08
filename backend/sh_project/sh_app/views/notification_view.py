from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ..models import Notification
from ..serializers import NotificationSerializer
from ..email_service import send_email

@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def notification_view(request):
    try:
        notifications = Notification.objects.filter(user=request.user).order_by('-created_at')
    except Notification.DoesNotExist:
        return Response({'error': 'Notifications not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    if request.method == 'PATCH':
        if notifications.filter(is_read=False).exists():
            notifications.update(is_read=True)
            return Response({'message': 'All notifications marked as read.'}, status=status.HTTP_200_OK)
        else:
            notifications.update(is_read=False)
            return Response({'message': 'All notifications marked as unread.'}, status=status.HTTP_200_OK)

@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def notification_detail_view(request, pk):
    try:
        notification = Notification.objects.get(pk=pk, user=request.user)
    except Notification.DoesNotExist:
        return Response({'error': 'Notification not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = NotificationSerializer(notification)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    if request.method == 'PATCH':
        if not notification.is_read:
            notification.is_read = True
            notification.save()
            return Response({'message': 'Notification marked as read.'}, status=status.HTTP_200_OK)
        
        else:
            notification.is_read = False
            notification.save()
            return Response({'message': 'Notification marked as unread.'}, status=status.HTTP_200_OK)
        
    if request.method == 'DELETE':
        notification.delete()
        return Response({'message': 'Notification deleted.'}, status=status.HTTP_200_OK)