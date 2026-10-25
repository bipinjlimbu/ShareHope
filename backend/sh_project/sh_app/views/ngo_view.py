from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ..models import User, NGO, NGODocument, NGOMembership
from ..serializers import NGOSerializer
from ..email_service import send_email
import re

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def register_ngo_view(request):
    if request.method == 'POST':
        errors = {}
        
        if request.user.role != User.Role.NGO_ADMIN:
            return Response({'error': 'Only users with NGO role can register an NGO.'}, status=status.HTTP_403_FORBIDDEN)
        
        if NGO.objects.filter(status=NGO.Status.PENDING, created_by=request.user).exists():
            return Response({'error': 'You already have a pending NGO registration.'}, status=status.HTTP_400_BAD_REQUEST)
        
        if NGO.objects.filter(status=NGO.Status.APPROVED, created_by=request.user).exists():
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
        elif NGO.objects.filter(status=NGO.Status.APPROVED, email=email).exists():
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
        
        subject = 'NGO Registration Request'
        message = f'Dear {request.user.first_name},\n\nYour NGO registration request for "{ngo.name}" has been received and is pending approval. We will notify you once the review process is complete.\n\nThank you for your contribution to our community.\n\nBest regards,\nShareHope Team'
        send_email(subject, message, [request.user.email])
        
        return Response({'message': 'NGO registered successfully.'}, status=status.HTTP_201_CREATED)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_ngo_by_user_view(request):
    if request.method == 'GET':
        try:
            ngo = NGO.objects.get(created_by=request.user)
            serializer = NGOSerializer(ngo)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except NGO.DoesNotExist:
            return Response({'error': 'NGO not found for the user.'}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ngo_view(request):
    if request.method == 'GET':
        ngos = NGO.objects.all()
        serializer = NGOSerializer(ngos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def ngo_detail_view(request, pk):
    try:
        ngo = NGO.objects.get(id=pk)
    except NGO.DoesNotExist:
        return Response({'error': 'NGO not found.'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = NGOSerializer(ngo)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    if request.method == 'PATCH':
        if request.user.role != User.Role.ADMIN:
            return Response({'error': 'Only admin users can update NGO details.'}, status=status.HTTP_403_FORBIDDEN)
        
        is_active = request.data.get('is_active') == True
        ngo.is_active = is_active
        ngo.save()
        
        if is_active:
            subject = 'NGO Approved'
            message = f'Dear {ngo.created_by.first_name},\n\nYour NGO "{ngo.name}" has been approved and is now active. You can now manage your NGO and its activities.\n\nThank you for your contribution to our community.\n\nBest regards,\nShareHope Team'
            send_email(subject, message, [ngo.created_by.email])
            
            return Response({'message': 'NGO activated successfully.'}, status=status.HTTP_200_OK)
                   
        else:
            subject = 'NGO Deactivated'
            message = f'Dear {ngo.created_by.first_name},\n\nYour NGO "{ngo.name}" has been deactivated. Please contact the admin for more information.\n\nBest regards,\nShareHope Team'
            send_email(subject, message, [ngo.created_by.email])
            
            return Response({'message': 'NGO deactivated successfully.'}, status=status.HTTP_200_OK)
        
    if request.method == 'DELETE':
        if request.user.role != User.Role.ADMIN:
            return Response({'error': 'Only admin users can delete NGO details.'}, status=status.HTTP_403_FORBIDDEN)
        
        email = ngo.created_by.email 
        ngo.delete()
        
        subject = 'NGO Deleted'
        message = f'Dear {ngo.created_by.first_name},\n\nYour NGO "{ngo.name}" has been deleted by the admin. Please contact the admin for more information.\n\nBest regards,\nShareHope Team'
        send_email(subject, message, [email])
        
        return Response({'message': 'NGO deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)