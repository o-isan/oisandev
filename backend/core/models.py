from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager
from django.conf import settings


class SoftDeleteModel(models.Model):

    class SoftDeleteUserManager(UserManager):
        def get_queryset(self):
            return super().get_queryset().filter(is_deleted=False)

    class SoftDeleteManager(models.Manager):
        def get_queryset(self):
            return super().get_queryset().filter(is_deleted=False)

    is_deleted = models.BooleanField(default=False)
    objects = SoftDeleteManager()
    all_objects = models.Manager()

    class Meta:
        abstract = True

    def delete(self, using=None, keep_parents=False):
        if self.is_deleted:
            return
        self.is_deleted = True
        self.save(update_fields=["is_deleted"])

class User(AbstractUser):
    pass

class Tag(SoftDeleteModel):
    name = models.CharField(max_length=50, unique=True)
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return self.name
    

class Category(SoftDeleteModel):
    title = models.CharField(max_length=50)
    description = models.CharField(max_length=100, null=True)
    slug = models.CharField(max_length=50, unique=True)
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return self.name
    

class Page(SoftDeleteModel):

    STATE_DRAFT = 0
    STATE_PUBLISHED = 1

    STATE_CHOICES = (
        (STATE_DRAFT, "Borrador"),
        (STATE_PUBLISHED, "Publicación"),
    )

    state = models.IntegerField(
        choices=STATE_CHOICES,
        default=STATE_PUBLISHED
    )
    
    cover_image = models.ImageField(upload_to="pages/", null=True, blank=True)
    title = models.CharField(max_length=100)
    description = models.CharField(max_length=200, null=True)
    keywords = models.CharField(max_length=200, null=True)
    slug = models.CharField(max_length=255, unique=True)
    content = models.TextField()
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='pages')
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        to_field="slug",
        related_name='pages'
    )

    tags = models.ManyToManyField(
        Tag
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_deleted = models.BooleanField(default=False)

    def add_tag(self, tag_name):
        tag, created = Tag.objects.get_or_create(name=tag_name)
        self.tags.add(tag)

    def remove_tag(self, tag_name):
        tag = self.tags.get(name=tag_name)
        self.tags.remove(tag)

    def __str__(self):
        return self.title


class Comment(SoftDeleteModel):
    page = models.ForeignKey(Page, on_delete=models.CASCADE, related_name='comments')
    author = models.CharField(max_length=50)
    content = models.TextField(max_length=500)
    author_email = models.EmailField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return f"Comment by {self.author.username} on {self.page.title}"
