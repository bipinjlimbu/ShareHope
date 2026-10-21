from datetime import timedelta
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password, check_password
from ..models import User, NGO, NGODocument, NGOMembership
from ..serializers import UserSerializer
from ..email_service import send_email
import secrets
import re

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def register_ngo_view(request):
    if request.method == 'POST':
        errors = {}
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
        
        return Response({'message': 'NGO registered successfully.'}, status=status.HTTP_201_CREATED)