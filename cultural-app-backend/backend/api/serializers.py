from rest_framework import serializers
from .models import User
from .models import Company
from .models import Event
from .models import Artist
from .models import Notification
from .models import Photo

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "is_active",
            "email",
            "company",
            "companyRole",
            "lastTimeNotifOpened",
            "followedEvents",
            "followedCompanies",
            "followedArtists",
            "longitude",
            "latitude",
            "tags",
            "hasSpotify"
        ]
class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = "__all__"
    
class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = "__all__"
class ArtistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artist
        fields = "__all__"
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = "__all__"
class PhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = "__all__"
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "password",
            "company",
            "first_name",
            "last_name",
            "companyRole"
        ]
        def create(self, validated_data):
            user = User.objects.create_user(
                username=validated_data["username"],
                email=validated_data.get("email"),
                password=validated_data["password"],
                first_name = validated_data.get("first_name"),
                last_name = validated_data.get("last_name"),
                company=validated_data.get("company"),
                companyRole=validated_data.get("companyRole"),
            )
            return user
class LoginSerializer(serializers.Serializer):
    login = serializers.CharField()
    password = serializers.CharField()