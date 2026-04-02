from rest_framework import serializers
from core.models import Category

class CategoryListSerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        exclude = ("is_deleted",)
