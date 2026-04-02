from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny

from core.models import Tag
from core.v1.serializers.tags.read import *
from core.v1.serializers.tags.write import *
from core.mixins.soft_delete import SoftDeleteMixin

from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination

class TagViewSet(SoftDeleteMixin, ModelViewSet):

    queryset = Tag.objects.all()
    serializer_class = TagListSerializer
    lookup_field = "name"
    pagination_class = PageNumberPagination

    serializer_action_classes = {
        "list": TagListSerializer,
        "create": TagWriterSerializer,
        "retrieve":TagListSerializer
    }

    def get_paginate_by(self, queryset):
        return 10000

    def get_serializer_class(self):
        return self.serializer_action_classes.get(self.action, self.serializer_class)

    def get_permissions(self):
        if self.action in ['create', 'destroy']:
            return [IsAuthenticated()]
                
        return [AllowAny()]


    # GET /pages/
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    # POST /pages/
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    # DELETE /pages/{id}/
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
