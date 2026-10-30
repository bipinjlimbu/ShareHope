from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from PIL import Image
from ..models import User, Campaign, NGO, PendingCampaignChange
from ..serializers import CampaignSerializer, NGOSerializer
from ..email_service import send_email
import re

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def campaign_view(request):
    if request.method == 'GET':
        campaigns = Campaign.objects.all()
        serializer = CampaignSerializer(campaigns, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    if request.method == 'POST':
        errors = {}
        
        title = request.data.get('title')
        description = request.data.get('description')
        category = request.data.get('category')
        donation_type = request.data.get('donation_type')
        goal_amount = request.data.get('goal_amount')
        goal_quantity = request.data.get('goal_quantity')
        goal_item_name = request.data.get('goal_item_name')
        currency = request.data.get('currency')
        start_date = request.data.get('start_date')
        end_date = request.data.get('end_date')
        campaign_status = request.data.get('status')
        campaign_image = request.FILES.get('campaign_image')
        
        title_pattern = r'^[A-Za-z0-9\s\-\_\.\,\!\?]+$'
        category_pattern = r'^[A-Za-z\s]+$'
        goal_amount_pattern = r'^\d+(\.\d{1,2})?$'
        goal_quantity_pattern = r'^\d+$'
        goal_item_name_pattern = r'^[A-Za-z0-9\s\-\_\.\,\!\?]+$'
        currency_pattern = r'^[A-Z]{3}$'
        campaign_image_pattern = r'^[\w,\s-]+\.(jpg|jpeg|png)$'
        
        if not title:
            errors['title'] = 'Title is required.'
        elif not re.match(title_pattern, title):
            errors['title'] = 'Title should only contain letters, numbers, spaces, and basic punctuation.'
            
        if not description:
            errors['description'] = 'Description is required.'
        
        if not category:
            errors['category'] = 'Category is required.'
        elif not re.match(category_pattern, category):
            errors['category'] = 'Category should only contain letters and spaces.'
            
        if not donation_type:
            errors['donation_type'] = 'Donation type is required.'
            
        if donation_type == Campaign.DonationType.FUND:
            if not goal_amount:
                errors['goal_amount'] = 'Goal amount is required for fund donation type.'
            elif not re.match(goal_amount_pattern, str(goal_amount)):
                errors['goal_amount'] = 'Goal amount should be a valid number with up to two decimal places.'
        elif donation_type == Campaign.DonationType.ITEM:
            if not goal_quantity:
                errors['goal_quantity'] = 'Goal quantity is required for item donation type.'
            elif not re.match(goal_quantity_pattern, str(goal_quantity)):
                errors['goal_quantity'] = 'Goal quantity should be a valid integer.'
                
            if not goal_item_name:
                errors['goal_item_name'] = 'Goal item name is required for item donation type.'
            elif not re.match(goal_item_name_pattern, goal_item_name):
                errors['goal_item_name'] = 'Goal item name should only contain letters, numbers, spaces, and basic punctuation.'
        else:
            if not goal_amount:
                errors['goal_amount'] = 'Goal amount is required for fund donation type.'
            elif not re.match(goal_amount_pattern, str(goal_amount)):
                errors['goal_amount'] = 'Goal amount should be a valid number with up to two decimal places.'
                
            if not goal_quantity:
                errors['goal_quantity'] = 'Goal quantity is required for item donation type.'
            elif not re.match(goal_quantity_pattern, str(goal_quantity)):
                errors['goal_quantity'] = 'Goal quantity should be a valid integer.'
                
            if not goal_item_name:
                errors['goal_item_name'] = 'Goal item name is required for item donation type.'
            elif not re.match(goal_item_name_pattern, goal_item_name):
                errors['goal_item_name'] = 'Goal item name should only contain letters, numbers, spaces, and basic punctuation.'

        if not currency:
            errors['currency'] = 'Currency is required.'
        elif not re.match(currency_pattern, currency):
            errors['currency'] = 'Currency should be a valid 3-letter currency code.'
            
        if not start_date:
            errors['start_date'] = 'Start date is required.'
            
        if not end_date:
            errors['end_date'] = 'End date is required.'
            
        if not campaign_image:
            errors['campaign_image'] = 'Campaign image is required.'
        elif not re.match(campaign_image_pattern, campaign_image.name):
            errors['campaign_image'] = 'Campaign image must be a valid image file (jpg, jpeg, png).'
        else:
            try:
                image = Image.open(campaign_image)
                width, height = image.size
                aspect_ratio = width / height
                if not (1.77 <= aspect_ratio <= 1.78):
                    errors['campaign_image'] = 'Campaign image must have a 16:9 aspect ratio.'
            except Exception as e:
                errors['campaign_image'] = 'Invalid image file.'
            
        if errors:
            return Response({'errors': errors}, status=status.HTTP_400_BAD_REQUEST)
        
        campaign = Campaign.objects.create(
            ngo=NGO.objects.filter(created_by=request.user).first(),
            title=title,
            description=description,
            category=category,
            donation_type=donation_type,
            goal_amount=goal_amount if donation_type in [Campaign.DonationType.FUND, Campaign.DonationType.BOTH] else None,
            goal_quantity=goal_quantity if donation_type in [Campaign.DonationType.ITEM, Campaign.DonationType.BOTH] else None,
            goal_item_name=goal_item_name if donation_type in [Campaign.DonationType.ITEM, Campaign.DonationType.BOTH] else None,
            currency=currency,
            start_date=start_date,
            end_date=end_date,
            status=campaign_status if campaign_status else Campaign.Status.PENDING,
            campaign_image=campaign_image,
            created_by=request.user
        )
        campaign.save()
        
        ngo = campaign.ngo
        subject = 'New Campaign Created'
        message = f'A new campaign titled "{campaign.title}" has been created by {request.user.username}. Please review and approve it.'
        send_email(subject, message, [ngo.email])
        
        return Response({'message': 'Campaign created successfully.'}, status=status.HTTP_201_CREATED)
    
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([AllowAny])
def campaign_detail_view(request, pk):
    try:
        campaign = Campaign.objects.get(pk=pk)
    except Campaign.DoesNotExist:
        return Response({'error': 'Campaign not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = CampaignSerializer(campaign)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    if request.method == 'PUT':
        errors = {}
        
        title = request.data.get('title', campaign.title)
        description = request.data.get('description', campaign.description)
        goal_amount = request.data.get('goal_amount', campaign.goal_amount)
        goal_quantity = request.data.get('goal_quantity', campaign.goal_quantity)
        end_date = request.data.get('end_date', campaign.end_date)
        campaign_image = request.FILES.get('campaign_image', campaign.campaign_image)
        
        title_pattern = r'^[A-Za-z0-9\s\-\_\.\,\!\?]+$'
        goal_amount_pattern = r'^\d+(\.\d{1,2})?$'
        goal_quantity_pattern = r'^\d+$'
        campaign_image_pattern = r'^[\w,\s-]+\.(jpg|jpeg|png)$'
        
        if not title:
            errors['title'] = 'Title is required.'
        elif not re.match(title_pattern, title):
            errors['title'] = 'Title should only contain letters, numbers, spaces, and basic punctuation.'
            
        if campaign.donation_type in [Campaign.DonationType.FUND, Campaign.DonationType.BOTH]:
            if not goal_amount:
                errors['goal_amount'] = 'Goal amount is required for fund donation type.'
            elif not re.match(goal_amount_pattern, str(goal_amount)):
                errors['goal_amount'] = 'Goal amount should be a valid number with up to two decimal places.'
        elif campaign.donation_type in [Campaign.DonationType.ITEM, Campaign.DonationType.BOTH]:
            if not goal_quantity:
                errors['goal_quantity'] = 'Goal quantity is required for item donation type.'
            elif not re.match(goal_quantity_pattern, str(goal_quantity)):
                errors['goal_quantity'] = 'Goal quantity should be a valid integer.'
                
        if not end_date:
            errors['end_date'] = 'End date is required.'
        elif end_date <= campaign.start_date:
            errors['end_date'] = 'End date must be after the start date.'
        
        if campaign_image and not re.match(campaign_image_pattern, campaign_image.name):
            errors['campaign_image'] = 'Campaign image must be a valid image file (jpg, jpeg, png).'
        elif campaign_image:
            try:
                image = Image.open(campaign_image)
                width, height = image.size
                aspect_ratio = width / height
                if not (1.77 <= aspect_ratio <= 1.78):
                    errors['campaign_image'] = 'Campaign image must have a 16:9 aspect ratio.'
            except Exception as e:
                errors['campaign_image'] = 'Invalid image file.'
                
        if errors:
            return Response({'errors': errors}, status=status.HTTP_400_BAD_REQUEST)
                
        pending_campaign_change = PendingCampaignChange.objects.create(
            campaign=campaign,
            title=title,
            description=description,
            goal_amount=goal_amount if campaign.donation_type in [Campaign.DonationType.FUND, Campaign.DonationType.BOTH] else None,
            goal_quantity=goal_quantity if campaign.donation_type in [Campaign.DonationType.ITEM, Campaign.DonationType.BOTH] else None,
            end_date=end_date,
            campaign_image=campaign_image if campaign_image != campaign.campaign_image else None,
            submitted_by=request.user
        )
        pending_campaign_change.save()
        
        ngo = campaign.ngo
        subject = 'Campaign Update Submitted'
        message = f'An update for the campaign titled "{campaign.title}" has been submitted by {request.user.username}. Please review and approve it.'
        send_email(subject, message, [ngo.email])
        
        return Response({'message': 'Campaign update submitted for approval.'}, status=status.HTTP_200_OK)
    
    if request.method == 'DELETE':
        ngo = campaign.ngo
        campaign.delete()
        
        subject = 'Campaign Deleted'
        message = f'The campaign titled "{campaign.title}" has been deleted by {request.user.username}. Please review the deletion.'
        send_email(subject, message, [ngo.email])
        
        return Response({'message': 'Campaign deleted successfully.'}, status=status.HTTP_200_OK)