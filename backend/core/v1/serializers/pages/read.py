from rest_framework import serializers
from core.models import Page, Category, Tag

class PageReadSerializer(serializers.ModelSerializer):
    tags = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field="name"
    )

    category = serializers.SlugRelatedField(
        read_only=True,
        slug_field="slug"
    )

    author = serializers.StringRelatedField()

    class Meta:
        model = Page
        exclude = ("is_deleted", "content")

class PageDetailReadSerializer(serializers.ModelSerializer):
    tags = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field="name"
    )

    category = serializers.SlugRelatedField(
        read_only=True,
        slug_field="slug"
    )

    author = serializers.StringRelatedField()

    class Meta:
        model = Page
        exclude = ("is_deleted",)
