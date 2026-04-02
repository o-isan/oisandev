from rest_framework.response import Response
from rest_framework import status

class SoftDeleteMixin:
    """
    Añade soft delete (is_deleted=True) en lugar de borrar físicamente
    """
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_deleted = True
        instance.save(update_fields=["is_deleted"])
        return Response(status=status.HTTP_204_NO_CONTENT)
