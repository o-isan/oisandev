from rest_framework import serializers
from core.models import Comment, Page

class CommentWriteSerializer(serializers.Serializer):
    content = serializers.CharField(required=True)
    author_email = serializers.EmailField(required=True)
    author = serializers.CharField(max_length=50, required=True)

    def create(self, validated_data):
        return Comment.objects.create(**validated_data)
