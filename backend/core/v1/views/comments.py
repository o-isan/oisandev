from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status

from core.models import Comment
from core.v1.serializers.comments.read import *
from core.v1.serializers.comments.write import *

from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination

class CommentViewSet(ModelViewSet):

    queryset = Comment.objects.all().select_related('page').order_by('-created_at')
    serializer_class = CommentListSerializer

    serializer_action_classes = {
        "list": CommentListSerializer,
        "retrieve": CommentDetailSerializer
    }

    pagination_class = PageNumberPagination
    filter_backends = [DjangoFilterBackend]

    def get_serializer_class(self):
        return self.serializer_action_classes.get(self.action, self.serializer_class)
    
    # GET /pages/
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
    
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)