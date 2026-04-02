# Register your models here.
from django.contrib import admin
from .models import Page, Category, Tag, Comment

admin.site.register(Page)
admin.site.register(Category)
admin.site.register(Tag)
admin.site.register(Comment)