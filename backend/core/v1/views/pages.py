from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny

from core.models import Page, Comment
from core.v1.serializers.pages.read import *
from core.v1.serializers.pages.write import *
from core.v1.serializers.comments.write import CommentWriteSerializer
from core.v1.serializers.comments.read import CommentsOfPageSerializer
from core.v1.serializers.tags.read import TagListSerializer
from core.mixins.soft_delete import SoftDeleteMixin
from core.filters import PageFilter

from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

class PageViewSet(SoftDeleteMixin, ModelViewSet):

    queryset = Page.objects.select_related('author', 'category').all().order_by('-updated_at')
    serializer_class = PageReadSerializer
    lookup_field = "slug"
    pagination_class = PageNumberPagination
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    

    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["category"]
    filterset_class = PageFilter

    serializer_action_classes = {
        "list": PageReadSerializer,
        "create": PageWriteSerializer,
        "retrieve": PageDetailReadSerializer,
        "partial_update" : PageWriteSerializer
    }

    def get_serializer_class(self):
        return self.serializer_action_classes.get(self.action, self.serializer_class)
    
    def get_permissions(self):
        if self.action in ['create', 'partial_update', 'destroy']:
            return [IsAuthenticated()]
                
        return [AllowAny()]

    # GET /pages/
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    # POST /pages/
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)
    
    # Se ejecuta después de llamar a create
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    # GET /pages/{id}/
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    # PATCH /pages/{id}/
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    # DELETE /pages/{id}/
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
        
    @action(detail=True, methods=["get"], serializer_class=CommentsOfPageSerializer)
    def comments(self, request, pk=None, **kwargs):
        page = self.get_object()
        comments_qs = page.comments.all().order_by('-created_at')

        # Paginación manual
        paginator = self.paginator  # DRF usa self.paginator basado en pagination_class
        page_comments = paginator.paginate_queryset(comments_qs, request)

        serializer = self.get_serializer(page_comments, many=True)
        return paginator.get_paginated_response(serializer.data)
    

    @comments.mapping.post
    def create_comment(self, request, pk=None, **kwargs):
        page = self.get_object()
        serializer = CommentWriteSerializer(
            data=request.data
        )
        serializer.is_valid(raise_exception=True)
        serializer.save(page=page)
        return Response(serializer.data, status=201)

    
    # GET /pages/page-slug/tags
    @action(detail=True, methods=["get"], serializer_class=TagListSerializer)
    def tags(self, request, pk=None, **kwargs):
        page = self.get_object()
        tags = page.tags.all()
        serializer = self.get_serializer(tags, many=True)
        return Response(serializer.data)
    
    # POST /pages/page-slug/tags
    @tags.mapping.post
    def add_tag(self, request, pk=None, **kwargs):
        page = self.get_object()
        tag_names = request.data.get("tags", [])

        if not isinstance(tag_names, list) or not tag_names:
            return Response({"detail": "Se requiere una lista de tags"}, status=400)

        for name in tag_names:
            page.add_tag(name)

        serializer = self.get_serializer(page.tags.all(), many=True)
        return Response(serializer.data, status=200)
    
    # DELETE /pages/page-slug/tags/tag-name
    @action(
        detail=True,
        methods=["delete"],
        url_path=r"tags/(?P<tag_name>[^/.]+)",
        serializer_class=TagListSerializer
    )
    def delete_tag(self, request, pk=None, tag_name=None, **kwargs):
        page = self.get_object()
        try:
            page.remove_tag(tag_name)
        except Tag.DoesNotExist:
            return Response({"detail": "Tag no encontrado"}, status=404)
        serializer = self.get_serializer(page.tags.all(), many=True)
        return Response(serializer.data, status=200)
