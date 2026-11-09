from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from PIL import Image
from ..models import User, NGO, PendingNGOChange, NGODocument, NGOMembership, Notification
from ..serializers import NGOSerializer, PendingNGOChangeSerializer
from ..email_service import send_email
import re
    
@api_view(['GET', 'DELETE'])
@permission_classes([IsAuthenticated])
def ngo_by_user_view(request):
    try:
        ngo = NGO.objects.get(created_by=request.user)
    except NGO.DoesNotExist:
        return Response({'error': 'NGO not found for the user.'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = NGOSerializer(ngo)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    if request.method == 'DELETE':
        email = ngo.email
        ngo_name = ngo.name
        ngo_created_by = ngo.created_by.first_name
        ngo.delete()
        
        notification = Notification.objects.create(
            user=ngo.created_by,
            type=Notification.NotificationType.NGO,
            title='NGO Deleted',
            message=f'Your NGO "{ngo_name}" has been deleted by you. Please contact the admin for more information.'
        )
        notification.save()
        
        notification_admin = Notification.objects.create(
            user=User.objects.filter(role=User.Role.ADMIN).first(),
            type=Notification.NotificationType.NGO,
            title='NGO Deleted',
            message=f'The NGO "{ngo_name}" created by {ngo_created_by} has been deleted. Please review the deletion.'
        )
        notification_admin.save()
        
        subject = 'NGO Deleted'
        message = f'Dear {ngo_created_by},\n\nYour Rejected NGO "{ngo_name}" Application has been deleted. Please contact the admin for more information.\n\nBest regards,\nShareHope Team'
        send_email(subject, message, [email])
        
        return Response({'message': 'NGO deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
    
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def ngo_view(request):
    if request.method == 'GET':
        ngos = NGO.objects.all()
        serializer = NGOSerializer(ngos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    if request.method == 'POST':
        errors = {}
        
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)
        
        if request.user.role != User.Role.NGO_ADMIN:
            return Response({'error': 'Only users with NGO role can register an NGO.'}, status=status.HTTP_403_FORBIDDEN)
        
        if NGO.objects.filter(status=NGO.Status.PENDING, created_by=request.user).exists():
            return Response({'error': 'You already have a pending NGO registration.'}, status=status.HTTP_400_BAD_REQUEST)
        
        if NGO.objects.filter(status=NGO.Status.ACTIVE, created_by=request.user).exists():
            return Response({'error': 'You already Registered an NGO.'}, status=status.HTTP_400_BAD_REQUEST)
        
        name = request.data.get('name')
        registration_number = request.data.get('registration_number')
        description = request.data.get('description')
        email = request.data.get('email')
        phone = request.data.get('phone')
        address = request.data.get('address')
        ngo_logo = request.data.get('ngo_logo')
        ngo_document_type = request.data.get('ngo_document_type')
        ngo_document_file = request.FILES.get('ngo_document_file')
        
        name_pattern = r'^[a-zA-Z\s]+$'
        registration_number_pattern = r'^[a-zA-Z0-9]+$'
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        phone_pattern = r'^\+?[1-9]\d{0,15}$'
        address_pattern = r'^[a-zA-Z0-9\s,.-]+$'
        ngo_logo_pattern = r'^[a-zA-Z0-9\s,.-]+\.(jpg|jpeg|png)$'
        ngo_document_file_pattern = r'^[a-zA-Z0-9\s,.-]+\.(pdf|doc|docx)$'
        
        if not name:
            errors['name'] = 'NGO name is required.'
        elif not re.match(name_pattern, name):
            errors['name'] = 'Name can only contain letters and spaces.'
            
        if not registration_number:
            errors['registration_number'] = 'NGO registration number is required.'
        elif not re.match(registration_number_pattern, registration_number):
            errors['registration_number'] = 'Registration number can only contain letters and numbers.'
            
        if not description:
            errors['description'] = 'Description about the NGO is required.'
            
        if not email:
            errors['email'] = 'NGO email is required.'
        elif NGO.objects.filter(status=NGO.Status.ACTIVE, email=email).exists():
            errors['email'] = 'NGO with this email already exists.'
        elif not re.match(email_pattern, email):
            errors['email'] = 'Invalid email format.'
            
        if not phone:
            errors['phone'] = 'NGO Contact number is required.'
        elif not re.match(phone_pattern, phone):
            errors['phone'] = 'Invalid phone number format.'
            
        if not address:
            errors['address'] = 'NGO address is required.'
        elif not re.match(address_pattern, address):
            errors['address'] = 'Address can only contain letters, numbers, spaces, commas, periods, and hyphens.'
            
        if not ngo_logo:
            errors['ngo_logo'] = 'NGO logo is required.'
        elif not re.match(ngo_logo_pattern, ngo_logo.name):
            errors['ngo_logo'] = 'NGO logo must be a valid image file (jpg, jpeg, png).'
        else:
            try:
                image = Image.open(ngo_logo)
                if image.size[0] != image.size[1]:
                    errors['ngo_logo'] = 'NGO logo must have an aspect ratio of 1:1.'
            except Exception as e:
                errors['ngo_logo'] = 'Error occurred while processing the image.'

        if not ngo_document_type:
            errors['ngo_document_type'] = 'NGO document type is required.'
            
        if not ngo_document_file:
            errors['ngo_document_file'] = 'NGO document file is required.'
        elif not re.match(ngo_document_file_pattern, ngo_document_file.name):
            errors['ngo_document_file'] = 'NGO document file must be a valid document file (pdf, doc, docx).'
            
        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)
        
        ngo = NGO.objects.create(
            name=name,
            registration_number=registration_number,
            description=description,
            email=email,
            phone=phone,
            address=address,
            status=NGO.Status.PENDING,
            ngo_logo=ngo_logo,
            created_by=request.user
        )
        
        ngo_document = NGODocument.objects.create(
            ngo=ngo,
            document_type=ngo_document_type,
            document_file=ngo_document_file
        )
        
        ngo_membership = NGOMembership.objects.create(
            ngo=ngo,
            user=request.user,
            status=NGOMembership.Status.ACTIVE
        )
        
        ngo.save()
        ngo_document.save()
        ngo_membership.save()
        
        notification = Notification.objects.create(
            user=request.user,
            type=Notification.NotificationType.NGO,
            title='NGO Registration Request',
            message=f'Your NGO registration request for "{ngo.name}" has been received and is pending approval. We will notify you once the review process is complete.'
        )
        notification.save()
        
        notification_admin = Notification.objects.create(
            user=User.objects.filter(role=User.Role.ADMIN).first(),
            type=Notification.NotificationType.NGO,
            title='New NGO Registration Request',
            message=f'User {request.user.username} has submitted a new NGO registration request for "{ngo.name}". Please review and approve or reject the request.'
        )
        notification_admin.save()
        
        subject = 'NGO Registration Request'
        message = f'Dear {request.user.first_name},\n\nYour NGO registration request for "{ngo.name}" has been received and is pending approval. We will notify you once the review process is complete.\n\nThank you for your contribution to our community.\n\nBest regards,\nShareHope Team'
        send_email(subject, message, [ngo.email])
        
        return Response({'message': 'NGO registered successfully.'}, status=status.HTTP_201_CREATED)
    
@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([AllowAny])
def ngo_detail_view(request, pk):
    try:
        ngo = NGO.objects.get(id=pk)
    except NGO.DoesNotExist:
        return Response({'error': 'NGO not found.'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = NGOSerializer(ngo)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    if request.method == 'PUT':
        if request.user != ngo.created_by:
            return Response({'error': 'You are not authorized to update this NGO.'}, status=status.HTTP_403_FORBIDDEN)
        
        if PendingNGOChange.objects.filter(ngo=ngo, submitted_by=request.user).exists():
            return Response({'error': 'You already have a pending change request for this NGO.'}, status=status.HTTP_400_BAD_REQUEST)
        
        errors = {}
        
        name = request.data.get('name')
        registration_number = request.data.get('registration_number')
        description = request.data.get('description')
        email = request.data.get('email')
        phone = request.data.get('phone')
        address = request.data.get('address')
        ngo_logo = request.data.get('ngo_logo')
        
        name_pattern = r'^[a-zA-Z\s]+$'
        registration_number_pattern = r'^[a-zA-Z0-9]+$'
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        phone_pattern = r'^\+?[1-9]\d{0,15}$'
        address_pattern = r'^[a-zA-Z0-9\s,.-]+$'
        ngo_logo_pattern = r'^[a-zA-Z0-9\s,.-]+\.(jpg|jpeg|png)$'
        
        if not name:
            errors['name'] = 'NGO name is required.'
        elif not re.match(name_pattern, name):
            errors['name'] = 'Name can only contain letters and spaces.'
            
        if not registration_number:
            errors['registration_number'] = 'NGO registration number is required.'
        elif not re.match(registration_number_pattern, registration_number):
            errors['registration_number'] = 'Registration number can only contain letters and numbers.'
        elif NGO.objects.filter(status=NGO.Status.APPROVED, registration_number=registration_number).exclude(id=ngo.id).exists():
            errors['registration_number'] = 'NGO with this registration number already exists.'
            
        if not description:
            errors['description'] = 'Description about the NGO is required.'
            
        if not email:
            errors['email'] = 'NGO email is required.'
        elif not re.match(email_pattern, email):
            errors['email'] = 'Invalid email format.'
        elif NGO.objects.filter(status=NGO.Status.APPROVED, email=email).exclude(id=ngo.id).exists():
            errors['email'] = 'NGO with this email already exists.'
            
        if not phone:
            errors['phone'] = 'NGO Contact number is required.'
        elif not re.match(phone_pattern, phone):
            errors['phone'] = 'Invalid phone number format.'
            
        if not address:
            errors['address'] = 'NGO address is required.'
        elif not re.match(address_pattern, address):
            errors['address'] = 'Address can only contain letters, numbers, spaces, commas, periods, and hyphens.'
            
        if ngo_logo and not re.match(ngo_logo_pattern, ngo_logo.name):
            errors['ngo_logo'] = 'NGO logo must be a valid image file (jpg, jpeg, png).'
            
        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)
            
        ngo_change = PendingNGOChange.objects.create(
            ngo=ngo,
            name=name,
            registration_number=registration_number,
            description=description,
            email=email,
            phone=phone,
            address=address,
            ngo_logo=ngo_logo if ngo_logo else ngo.ngo_logo,
            submitted_by=request.user
        )
        ngo_change.save()
        
        notification = Notification.objects.create(
            user=request.user,
            type=Notification.NotificationType.NGO,
            title='NGO Change Request Submitted',
            message=f'Your change request for NGO "{ngo.name}" has been submitted and is pending approval. We will notify you once the review process is complete.'
        )
        notification.save()
        
        notification_admin = Notification.objects.create(
            user=User.objects.filter(role=User.Role.ADMIN).first(),
            type=Notification.NotificationType.NGO,
            title='New NGO Change Request',
            message=f'User {request.user.username} has submitted a change request for NGO "{ngo.name}". Please review and approve or reject the request.'
        )
        notification_admin.save()
        
        subject = 'NGO Change Request Submitted'
        message = f'Dear {request.user.first_name},\n\nYour change request for NGO "{ngo.name}" has been submitted and is pending approval. We will notify you once the review process is complete.\n\nThank you for your contribution to our community.\n\nBest regards,\nShareHope Team'
        send_email(subject, message, [ngo.email])
        return Response({'message': 'NGO change request submitted successfully.'}, status=status.HTTP_200_OK)
    
    if request.method == 'PATCH':
        if request.user.role != User.Role.ADMIN:
            return Response({'error': 'Only admin users can update NGO details.'}, status=status.HTTP_403_FORBIDDEN)
        
        status_change = request.data.get('status')
        
        if ngo.status == NGO.Status.PENDING:
            ngo.status = status_change
            ngo.reviewed_by = request.user
            ngo.save()
            
            if status_change == NGO.Status.ACTIVE:
                notification = Notification.objects.create(
                    user=ngo.created_by,
                    type=Notification.NotificationType.NGO,
                    title='NGO Approved',
                    message=f'Your NGO "{ngo.name}" has been approved and is now active. You can now manage your NGO and its activities.'
                )
                notification.save()
                
                subject = 'NGO Approved'
                message = f'Dear {ngo.created_by.first_name},\n\nYour NGO "{ngo.name}" has been approved and is now active. You can now manage your NGO and its activities.\n\nThank you for your contribution to our community.\n\nBest regards,\nShareHope Team'
                send_email(subject, message, [ngo.email])
                
            elif status_change == NGO.Status.REJECTED:
                notification = Notification.objects.create(
                    user=ngo.created_by,
                    type=Notification.NotificationType.NGO,
                    title='NGO Rejected',
                    message=f'Your NGO "{ngo.name}" registration has been rejected. Please contact the admin for more information.'
                )
                notification.save()
                
                subject = 'NGO Rejected'
                message = f'Dear {ngo.created_by.first_name},\n\nWe regret to inform you that your NGO "{ngo.name}" registration has been rejected. Please contact the admin for more information.\n\nBest regards,\nShareHope Team'
                send_email(subject, message, [ngo.email])
                
            return Response({'message': f'NGO status updated to {status_change} successfully.'}, status=status.HTTP_200_OK)
        
        else:
            if status_change not in [NGO.Status.ACTIVE, NGO.Status.INACTIVE]:
                return Response({'error': 'Invalid status change. Only ACTIVE or INACTIVE status changes are allowed for approved NGOs.'}, status=status.HTTP_400_BAD_REQUEST)
            
            ngo.status = status_change
            ngo.save()
            
            if status_change == NGO.Status.ACTIVE:
                notification = Notification.objects.create(
                    user=ngo.created_by,
                    type=Notification.NotificationType.NGO,
                    title='NGO Activated',
                    message=f'Your NGO "{ngo.name}" has been activated and is now active. You can now manage your NGO and its activities.'
                )
                notification.save()
                
                subject = 'NGO Activated'
                message = f'Dear {ngo.created_by.first_name},\n\nYour NGO "{ngo.name}" has been activated and is now active. You can now manage your NGO and its activities.\n\nThank you for your contribution to our community.\n\nBest regards,\nShareHope Team'
                send_email(subject, message, [ngo.email])
                
            elif status_change == NGO.Status.INACTIVE:
                notification = Notification.objects.create(
                    user=ngo.created_by,
                    type=Notification.NotificationType.NGO,
                    title='NGO Deactivated',
                    message=f'Your NGO "{ngo.name}" has been deactivated and is now inactive. Please contact the admin for more information.'
                )
                notification.save()
                
                subject = 'NGO Deactivated'
                message = f'Dear {ngo.created_by.first_name},\n\nWe regret to inform you that your NGO "{ngo.name}" has been deactivated and is now inactive. Please contact the admin for more information.\n\nBest regards,\nShareHope Team'
                send_email(subject, message, [ngo.email])
                
            return Response({'message': f'NGO status updated to {status_change} successfully.'}, status=status.HTTP_200_OK)
        
    if request.method == 'DELETE':
        if request.user.role != User.Role.ADMIN and request.user != ngo.created_by:
            return Response({'error': 'Only admin users and the NGO creator can delete NGO details.'}, status=status.HTTP_403_FORBIDDEN)
        
        email = ngo.email 
        ngo_name = ngo.name
        ngo_created_by = ngo.created_by.first_name
        ngo.delete()
        
        notification = Notification.objects.create(
            user=ngo.created_by,
            type=Notification.NotificationType.NGO,
            title='NGO Deleted',
            message=f'Your NGO "{ngo_name}" has been deleted by the admin. Please contact the admin for more information.'
        )
        notification.save()
        
        notification_admin = Notification.objects.create(
            user=User.objects.filter(role=User.Role.ADMIN).first(),
            type=Notification.NotificationType.NGO,
            title='NGO Deleted',
            message=f'The NGO "{ngo_name}" created by {ngo_created_by} has been deleted. Please review the deletion.'
        )
        notification_admin.save()

        subject = 'NGO Deleted'
        message = f'Dear {ngo_created_by},\n\nYour NGO "{ngo_name}" has been deleted by the admin. Please contact the admin for more information.\n\nBest regards,\nShareHope Team'
        send_email(subject, message, [email])
        
        return Response({'message': 'NGO deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def pending_ngo_change_view(request):
    pending_changes = PendingNGOChange.objects.all()
    serializer = PendingNGOChangeSerializer(pending_changes, many=True)
    return Response(serializer.data)

@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def pending_ngo_change_detail_view(request, pk):
    try:
        pending_change = PendingNGOChange.objects.get(pk=pk)
    except PendingNGOChange.DoesNotExist:
        return Response({'error': 'Pending NGO change not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = PendingNGOChangeSerializer(pending_change)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    if request.method == 'PATCH':
        if request.user.role != User.Role.ADMIN:
            return Response({'error': 'Only admin users can update pending NGO changes.'}, status=status.HTTP_403_FORBIDDEN)
        
        status_change = request.data.get('status')
        
        if status_change == "APPROVED":
            ngo = pending_change.ngo
            ngo.name = pending_change.name
            ngo.registration_number = pending_change.registration_number
            ngo.description = pending_change.description
            ngo.email = pending_change.email
            ngo.phone = pending_change.phone
            ngo.address = pending_change.address
            ngo.ngo_logo = pending_change.ngo_logo
            ngo.save()
            
            notification = Notification.objects.create(
                user=pending_change.submitted_by,
                type=Notification.NotificationType.NGO,
                title='NGO Change Request Approved',
                message=f'Your change request for NGO "{ngo.name}" has been approved and the changes have been applied.'
            )
            notification.save()
            
            subject = 'NGO Change Request Approved'
            message = f'Dear {pending_change.submitted_by.first_name},\n\nYour change request for NGO "{ngo.name}" has been approved and the changes have been applied.\n\nThank you for your contribution to our community.\n\nBest regards,\nShareHope Team'
            send_email(subject, message, [ngo.email])
            
            pending_change.delete()
            return Response({'message': 'Pending NGO change approved and applied successfully.'}, status=status.HTTP_200_OK)
        
        elif status_change == "REJECTED":
            notification = Notification.objects.create(
                user=pending_change.submitted_by,
                type=Notification.NotificationType.NGO,
                title='NGO Change Request Rejected',
                message=f'Your change request for NGO "{pending_change.ngo.name}" has been rejected. Please contact the admin for more information.'
            )
            notification.save()
            
            subject = 'NGO Change Request Rejected'
            message = f'Dear {pending_change.submitted_by.first_name},\n\nWe regret to inform you that your change request for NGO "{pending_change.ngo.name}" has been rejected. Please contact the admin for more information.\n\nBest regards,\nShareHope Team'
            send_email(subject, message, [pending_change.ngo.email])
            
            pending_change.delete()
            return Response({'message': 'Pending NGO change rejected successfully.'}, status=status.HTTP_200_OK)
        
        else:
            return Response({'error': 'Invalid status change. Only APPROVED or REJECTED status changes are allowed.'}, status=status.HTTP_400_BAD_REQUEST)