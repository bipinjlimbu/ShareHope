from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from ..models import User, Campaign, NGO
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
    