from rest_framework import serializers
from .models import User, NGO, NGODocument, NGOMembership

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        
class NGOSerializer(serializers.ModelSerializer):
    documents = serializers.SerializerMethodField()
    members = serializers.SerializerMethodField()
    document_count = serializers.SerializerMethodField()
    membership_count = serializers.SerializerMethodField()
    
    def get_documents(self, obj):
        documents = NGODocument.objects.filter(ngo=obj)
        return NGODocumentSerializer(documents, many=True).data
    
    def get_members(self, obj):
        members = NGOMembership.objects.filter(ngo=obj)
        return NGOMembershipSerializer(members, many=True).data
    
    def get_membership_count(self, obj):
        return NGOMembership.objects.filter(ngo=obj).count()
    
    def get_document_count(self, obj):
        return NGODocument.objects.filter(ngo=obj).count()
    
    class Meta:
        model = NGO
        fields = '__all__'
        
class NGODocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = NGODocument
        fields = '__all__'
        
class NGOMembershipSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    def get_member(self, obj):
        return UserSerializer(obj.user).data
    
    class Meta:
        model = NGOMembership
        fields = '__all__'