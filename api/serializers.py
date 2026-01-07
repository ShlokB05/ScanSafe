# api/serializers.py
from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserProfile



class RegisterSerializer(serializers.ModelSerializer):
    name = serializers.CharField(write_only = True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["name", "email", "password"]

    def create(self, validated_data):
        name = validated_data["name"].strip()
        email = validated_data["email"].strip().lower()
        user = User(username=email, email=email, first_name = name)
        user.set_password(validated_data["password"])
        user.save()
        UserProfile.objects.create(user=user)
        return user

class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField(read_only=True)
    allergens = serializers.ListField(child=serializers.CharField())
    def validate_allergens(self, value):
            return [str(x).strip().lower() for x in (value or []) if x]
    class Meta:
        model = UserProfile
        fields = ["username", "allergens"]

    def get_username(self, obj):
        return obj.user.username
