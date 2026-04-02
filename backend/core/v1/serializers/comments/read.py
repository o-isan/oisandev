from rest_framework import serializers
from core.models import Page, Comment

class CommentListSerializer(serializers.ModelSerializer):

    class PageSerializer(serializers.ModelSerializer):
        class Meta:
            model = Page
            fields = ['title', 'slug']

    content = serializers.SerializerMethodField()
    page_data = PageSerializer(source='page', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'author', 'author_email', 'content', 'created_at', 'page_data']

    def get_content(self, obj):
        return obj.content[:500]


class CommentsOfPageSerializer(serializers.ModelSerializer):
    content = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'author', 'author_email', 'content', 'created_at']

    def get_content(self, obj):
        return obj.content[:500]


class CommentDetailSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Comment
        exclude = ['is_deleted']

class CommentContentDetailSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Comment
        fields = ['content']
