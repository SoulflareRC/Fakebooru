import django.db.models.fields.files
import taggit.managers
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from django.contrib.auth import get_user_model
from model_utils.fields import AutoCreatedField, AutoLastModifiedField
from django.apps import apps
from django.db.models.signals import post_save,pre_save
from django.dispatch import receiver
from taggit.managers import TaggableManager
from taggit.models import TagBase,GenericTaggedItemBase
from pathlib import Path
from PIL import Image
from .utils.deepdanbooru import suggestTags
import hashlib
from django.contrib.contenttypes.fields import GenericRelation
from django.utils.timezone import now
from django.db.models.fields.files import ImageFieldFile
import os
from fluent_comments.models import FluentComment

def default_image_folder():
    return str(settings.DEFAULT_IMAGE_FOLDER)
class IndexedTimeStampedModel(models.Model):
    created = AutoCreatedField(_("created"), db_index=True)
    modified = AutoLastModifiedField(_("modified"), db_index=True)

    class Meta:
        abstract = True
User = get_user_model()

class MyTag(TagBase):
    CATEGORIES = [
        ("general","General"),
        ("artist","Artist"),
        ("copyright","Copyright"),
        ("character","Character"),
        ("uncategorized","Uncategorized"),
    ]
    category = models.CharField(choices=CATEGORIES,default='uncategorized',max_length=30)
    date = models.DateTimeField(auto_now_add=True)
    description = models.CharField(max_length=1000,blank=True)
    related = models.ManyToManyField('self',related_name="related_tags",blank=True)
    class Meta:
        verbose_name = _("Tag")
        verbose_name_plural = _("Tags")
        ordering = ('-date','name')
        indexes = [
            models.Index(fields=['name']),
        ]
class TaggedItem(GenericTaggedItemBase):
    tag = models.ForeignKey(
        MyTag,
        on_delete=models.CASCADE,
        # related_name="%(app_label)s_%(class)s_items",
        related_name="tagged_items",
    )
class Post(models.Model):
    uploader = models.ForeignKey(User,on_delete=models.CASCADE,default=1,related_name="posts_uploaded")
    publish_date = models.DateTimeField(auto_now_add=True)
    tags = TaggableManager(blank=True,through=TaggedItem,related_name="tagged_posts")
    RATINGS = [ # general,sensitive,questionable,explicit,unrated
        ('general','General'),
        ('sensitive','Sensitive'),
        ('questionable','Questionable'),
        ('explicit','Explicit'),
        ('unrated','Unrated')
    ]
    rating = models.CharField(choices=RATINGS,default='unrated',max_length=20)
    source = models.URLField(blank=True,null=True)

    image = models.ImageField(upload_to="original/",max_length=2000)
    thumb = models.ImageField(upload_to="thumb/",blank=True,editable=False,max_length=2000)
    preview = models.ImageField(upload_to="preview/",blank=True,editable=False,max_length=2000)
    hash = models.CharField(max_length=32,unique=True,editable=False)

    saved_by = models.ManyToManyField(User,related_name="saved_posts",blank=True) # this has to have a diff related name or user.post_set is ambiguous
    private = models.BooleanField(default=False,blank=False,null=False)
    pinned = models.BooleanField(default=False,blank=False,null=False)

    comments = GenericRelation(FluentComment,object_id_field="object_pk")

    class Meta:
        ordering = ["-pinned","-publish_date"]
    # def _suggest_image_tags(self,img_file):
    #     img = Image.open(img_file)
    #     tags = suggestTags(img)
    #     return tags
    def _calculate_image_hash(self,img:django.db.models.fields.files.ImageFieldFile):
        file = img.open('rb')
        content = file.read()
        hash = hashlib.md5(content).hexdigest()
        return hash
    def _process_image(self):
        THUMB_WIDTH = 200
        PREVIEW_WIDTH = 1080
        if self.image and (not self.thumb and not self.preview)   :
            img = Image.open(self.image)
            thumb = img.copy()
            thumb_height = int(img.height * THUMB_WIDTH / img.width)
            thumb.thumbnail((THUMB_WIDTH,thumb_height))
            preview = img.copy()
            preview_height = int(img.height * PREVIEW_WIDTH / img.width)
            preview.thumbnail((PREVIEW_WIDTH,preview_height))
            image_fname = self.image.name
            print("Image filename:",image_fname)
            thumb_folder = Path(settings.MEDIA_ROOT) / self.thumb.field.upload_to
            preview_folder = Path(settings.MEDIA_ROOT) /  self.preview.field.upload_to
            if not Path(settings.MEDIA_ROOT).exists():
                Path(settings.MEDIA_ROOT).mkdir()
            if not thumb_folder.exists():
                thumb_folder.mkdir()
            if not preview_folder.exists():
                preview_folder.mkdir()
            thumb_path = thumb_folder / image_fname
            preview_path = preview_folder / image_fname

            thumb.save(thumb_path)
            preview.save(preview_path)
            self.thumb = self.thumb.field.upload_to+ "/"+ image_fname
            self.preview = self.preview.field.upload_to+"/"+ image_fname
            if not self.hash:
                self.hash = self._calculate_image_hash(self.image)

            print("Image hash:",self.hash)

            # self.image.open()
    def save(self,**kwargs):
        self._process_image()
        super(Post, self).save(**kwargs)
        if not self.image.closed:
            self.image.close()

class Rating(models.Model):
    RATES = [(x, str(x)) for x in range(0,6)]
    post = models.ForeignKey(Post,related_name="ratings",on_delete=models.CASCADE)
    score = models.IntegerField(choices=RATES)
    by = models.ForeignKey(User,on_delete=models.CASCADE)

    class Meta:
        indexes = [
            models.Index(fields=['post', 'by']),
        ]
class CommentVote(models.Model):
    VOTES = [(x,str(x)) for x in (-1,0,1)]
    comment = models.ForeignKey(FluentComment,related_name="votes",on_delete=models.CASCADE)
    vote = models.IntegerField(choices=VOTES)
    by = models.ForeignKey(User,on_delete=models.CASCADE)


@receiver(post_save, sender=User)
def create_user_info(sender, instance, created, **kwargs):
    if created:
        UserInfo.objects.create(user=instance,display_name=instance.email)
        instance:User
        # if instance.

class UserInfo(models.Model):
    # to extend the predefined user model, use one2one field
    user = models.OneToOneField(User,on_delete=models.CASCADE,editable=False)
    display_name = models.CharField(max_length=50,blank=False,null=False,default="None")
    slogan = models.CharField(max_length=200,blank=True)
    icon = models.ImageField(max_length=500, blank=True,
                             upload_to=Path(settings.MEDIA_ROOT) / 'user' / 'icon',
                             default='icon_default.png')
    profile_bg = models.ImageField(max_length=500, blank=True,
                                   upload_to=Path(settings.MEDIA_ROOT) / 'user' / 'profile_background',
                                   default=default_image_folder()+"/profile_bg_default.png")

    linkedin_link = models.URLField(blank=True,null=True)
    github_link = models.URLField(blank=True,null=True)

