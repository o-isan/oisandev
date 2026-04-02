from rest_framework import serializers
from core.models import Category

class CategoryWriteSerializer(serializers.Serializer):

    def create(self, validated_data):
        return Category.objects.create(**validated_data)

    title = serializers.CharField(max_length=50, required=True)
    slug = serializers.CharField(max_length=50, required=True)
    description = serializers.CharField(max_length=100, required=False)
