from rest_framework import serializers
from core.models import User

class UserListSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'is_active']

