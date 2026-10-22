from rest_framework import serializers
from .models import User, NGO, NGODocument, NGOMembership

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        
class NGOSerializer(serializers.ModelSerializer):
    class Meta:
        model = NGO
        fields = '__all__'
        
class NGODocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = NGODocument
        fields = '__all__'
        
class NGOMembershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = NGOMembership
        fields = '__all__'