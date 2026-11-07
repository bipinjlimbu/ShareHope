from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from ..models import Notification, Testimonial, User, User
from ..serializers import TestimonialSerializer
from ..email_service import send_email
    
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def testimonial_view(request):
    if request.method == 'GET':
        testimonials = Testimonial.objects.all().order_by('-created_at')
        serializer = TestimonialSerializer(testimonials, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    if request.method == 'POST':
        if not request.user.is_authenticated:
            return Response({'error': 'You must be logged in to submit a testimonial.'}, status=status.HTTP_401_UNAUTHORIZED)
        
        if Testimonial.objects.filter(user=request.user).exists():
            return Response({'error': 'You have already submitted a testimonial.'}, status=status.HTTP_400_BAD_REQUEST)
        
        errors = {}

        rating = request.data.get('rating')
        comment = request.data.get('comment')

        if not rating:
            errors['rating'] = 'Rating is required.'
            
        if not comment:
            errors['comment'] = 'Comment is required.'
        elif len(comment) > 1000:
            errors['comment'] = 'Comment must be less than 1000 characters.'

        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        testimonial = Testimonial.objects.create(
            user=request.user,
            rating=rating,
            comment=comment
        )
        testimonial.save()
        
        notification = Notification.objects.create(
            user=request.user,
            type=Notification.NotificationType.TESTIMONIAL,
            title='Testimonial Submitted',
            message='Your testimonial has been successfully submitted.'
        )
        notification.save()
        
        notification_admin = Notification.objects.create(
            user=User.objects.filter(role=User.Role.ADMIN).first(),
            type=Notification.NotificationType.TESTIMONIAL,
            title='New Testimonial Submitted',
            message=f'User {request.user.username} has submitted a new testimonial.'
        )
        notification_admin.save()
        
        subject = "New Testimonial Submission"
        message = f"User: {request.user.username}\nRating: {rating}\nComment: {comment}"
        send_email(subject, message, [request.user.email])
        
        return Response({'message': 'Your testimonial has been submitted successfully.'}, status=status.HTTP_201_CREATED)
    
@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def testimonial_detail_view(request, pk):
    try:
        testimonial = Testimonial.objects.get(pk=pk, user=request.user)
    except Testimonial.DoesNotExist:
        return Response({'error': 'Testimonial not found or you do not have permission to modify it.'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'PUT':
        if not request.user.is_authenticated:
            return Response({'error': 'You must be logged in to update a testimonial.'}, status=status.HTTP_401_UNAUTHORIZED)
        
        if testimonial.user != request.user:
            return Response({'error': 'You do not have permission to update this testimonial.'}, status=status.HTTP_403_FORBIDDEN)
        
        errors = {}
        
        rating = request.data.get('rating')
        comment = request.data.get('comment')
        
        if not rating:
            errors['rating'] = 'Rating is required.'
            
        if not comment:
            errors['comment'] = 'Comment is required.'
        elif len(comment) > 1000:
            errors['comment'] = 'Comment must be less than 1000 characters.'
            
        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)
        
        testimonial.rating = rating
        testimonial.comment = comment
        testimonial.save()
        
        notification = Notification.objects.create(
            user=request.user,
            type=Notification.NotificationType.TESTIMONIAL,
            title='Testimonial Updated',
            message='Your testimonial has been successfully updated.'
        )
        notification.save()
        
        notification_admin = Notification.objects.create(
            user=User.objects.filter(role=User.Role.ADMIN).first(),
            type=Notification.NotificationType.TESTIMONIAL,
            title='Testimonial Updated',
            message=f'User {request.user.username} has updated their testimonial.'
        )
        notification_admin.save()
        
        subject = "Testimonial Updated"
        message = f"User: {request.user.username}\nUpdated Rating: {rating}\nUpdated Comment: {comment}"
        send_email(subject, message, [request.user.email])
        
        return Response({'message': 'Your testimonial has been updated successfully.'}, status=status.HTTP_200_OK)
    
    if request.method == 'DELETE':
        if not request.user.is_authenticated:
            return Response({'error': 'You must be logged in to delete a testimonial.'}, status=status.HTTP_401_UNAUTHORIZED)
        
        if testimonial.user != request.user and not request.user.is_staff:
            return Response({'error': 'You do not have permission to delete this testimonial.'}, status=status.HTTP_403_FORBIDDEN)
        
        testimonial.delete()
        
        notification = Notification.objects.create(
            user=request.user,
            type=Notification.NotificationType.TESTIMONIAL,
            title='Testimonial Deleted',
            message='Your testimonial has been successfully deleted.'
        )
        notification.save()
        
        notification_admin = Notification.objects.create(
            user=User.objects.filter(role=User.Role.ADMIN).first(),
            type=Notification.NotificationType.TESTIMONIAL,
            title='Testimonial Deleted',
            message=f'User {request.user.username} has deleted their testimonial.'
        )   
        notification_admin.save()
        
        subject = "Testimonial Deleted"
        message = f"User: {request.user.username} has deleted their testimonial."
        send_email(subject, message, [request.user.email])
        
        return Response({'message': 'Your testimonial has been deleted successfully.'}, status=status.HTTP_200_OK)