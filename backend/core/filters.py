import django_filters
from .models import Page

class PageFilter(django_filters.FilterSet):
    tag = django_filters.CharFilter(
        field_name="tags__name",
        lookup_expr="iexact"
    )

    category = django_filters.CharFilter(
        field_name="category__slug",
        lookup_expr="iexact"
    )

    class Meta:
        model = Page
        fields = ["tag", "category"]