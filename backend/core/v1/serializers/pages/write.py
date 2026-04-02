from rest_framework import serializers
from core.models import Page, Category, Tag

class PageWriteSerializer(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(
        slug_field="slug",
        queryset=Category.objects.all()
    )

    # Tags: aceptar lista de nombres, crear si no existen
    tags = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        allow_empty=True
    )

    cover_image = serializers.ImageField(
        required=False,
        allow_null=True
    )

    state = serializers.ChoiceField(
        choices=Page.STATE_CHOICES,
        default=Page.STATE_DRAFT
    )

    class Meta:
        model = Page
        fields = (
            "title",
            "description",
            "keywords",
            "slug",
            "content",
            "category",
            "state",
            "cover_image",
            "tags",
        )

    def create(self, validated_data):
        tags_data = validated_data.pop("tags", [])
        page = super().create(validated_data)

        # Asociar tags
        for tag_name in tags_data:
            tag, _ = Tag.objects.get_or_create(name=tag_name)
            page.tags.add(tag)

        return page

    def update(self, instance, validated_data):
        tags_data = validated_data.pop("tags", None)
        page = super().update(instance, validated_data)

        if tags_data is not None:
            # Limpiar tags actuales y agregar los nuevos
            page.tags.clear()
            for tag_name in tags_data:
                tag, _ = Tag.objects.get_or_create(name=tag_name)
                page.tags.add(tag)

        return page
    
    def to_representation(self, instance):
        from core.v1.serializers.pages.read import PageReadSerializer
        return PageReadSerializer(instance, context=self.context).data
