from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from core.models import User
from core.v1.serializers.users.read import *
from core.v1.serializers.users.write import *    

from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination

class UserViewSet(ModelViewSet):

    queryset = User.objects.all()
    serializer_class = UserListSerializer
    permission_classes = [IsAuthenticated]
    
    pagination_class = PageNumberPagination
    filter_backends = [DjangoFilterBackend]

    serializer_action_classes = {
        "list": UserListSerializer,
        "retrieve" : UserListSerializer
    }

    def get_serializer_class(self):
        return self.serializer_action_classes.get(self.action, self.serializer_class)

    # GET /pages/
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    # GET /pages/{id}/
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)
    
    
