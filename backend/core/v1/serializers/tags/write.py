from rest_framework import serializers
from core.models import Tag

class TagWriterSerializer(serializers.Serializer):

    name = serializers.CharField(max_length=50, required=True)

    def create(self, validated_data):
        return Tag.objects.create(**validated_data)