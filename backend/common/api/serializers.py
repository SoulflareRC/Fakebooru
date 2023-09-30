from django.shortcuts import reverse
from rest_framework import serializers
from django.contrib.auth import get_user_model
from common import models
from fluent_comments.models import FluentComment
from django.db.models import Avg,Count,Sum,Q
from django.contrib.sites.models import Site
from django.contrib.contenttypes.models import ContentType
from taggit.serializers import TaggitSerializer,TagListSerializerField
from allauth.account.models import EmailAddress
User = get_user_model()
class NoUpdateMixin(serializers.ModelSerializer):
    '''This mixin serves as a solution to make certain fields create & read only,
       but not update. To use, specify no_update_fields in the Meta class. '''
    class Meta:
        no_update_fields = ()
    def update(self, instance, validated_data):
        fields = self.Meta.no_update_fields
        for field in fields:
            validated_data.pop(field,None)
        print(f"Update to fields {fields} is forbidden.")
        return super().update(instance, validated_data)


class RatingSerializer(NoUpdateMixin,serializers.ModelSerializer):
    class Meta:
        model = models.Rating
        fields = "__all__"
        no_update_fields = ('by','post',)
    def create(self, validated_data):
        # print("Validated data:",validated_data)
        by = validated_data.get('by',None)
        post = validated_data.get('post',None)
        score = validated_data.get('score')
        rating,created = models.Rating.objects.update_or_create(
            by=by,post=post,defaults={'score':score}
        )
        return rating
class CommentVoteSerializer(NoUpdateMixin,serializers.ModelSerializer):
    class Meta:
        model = models.CommentVote
        fields = "__all__"
        no_update_fields = ('by','comment',)
    def create(self, validated_data):
        # print("Validated data:",validated_data)
        by = validated_data.get('by',None)
        comment = validated_data.get('comment',None)
        vote = validated_data.get('vote')
        rating,created = models.CommentVote.objects.update_or_create(
            by=by,comment=comment,defaults={'vote':vote}
        )
        return rating

class UserInfoSerializer(NoUpdateMixin,serializers.ModelSerializer):
    verified = serializers.SerializerMethodField()
    class Meta:
        model = models.UserInfo
        fields = "__all__"
        no_update_fields = ('user')
    def get_verified(self,uinfo:models.UserInfo):
        user = uinfo.user
        ea = EmailAddress.objects.filter(user=user).first()
        # print(uinfo.user.pk)
        # print(ea)
        return ea.verified
class SimpleUserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.UserInfo
        fields = ('display_name','user','icon','slogan','id')
from taggit.serializers import (TagListSerializerField,TaggitSerializer)
class SimpleMyTagSerializer(serializers.ModelSerializer):
    post_cnt = serializers.SerializerMethodField()
    class Meta:
        model = models.MyTag
        fields = ('id','post_cnt','category','name',)
    def get_post_cnt(self,tag):
        return tag.tagged_items.count()
class MyTagSerializer(SimpleMyTagSerializer):
    # tags = TagListSerializerField()
    tagged_posts = serializers.SerializerMethodField()
    related = SimpleMyTagSerializer(many=True)
    class Meta:
        model = models.MyTag
        fields = ('id', 'post_cnt', 'category', 'name','description','related','tagged_posts',)
    def get_tagged_posts(self,tag):

        tagged_posts = models.Post.objects.filter(tags=tag)[:15]
        return SimplePostSerializer(tagged_posts,many=True,context=self.context).data
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','email']
class SimplePostSerializer(serializers.ModelSerializer):
    saved_by = serializers.SerializerMethodField()
    saved_by_cnt = serializers.SerializerMethodField()
    image_height = serializers.SerializerMethodField()
    image_width = serializers.SerializerMethodField()
    image_size = serializers.SerializerMethodField()
    class Meta:
        model=models.Post
        fields = ('thumb','preview','image',
                  'id',
                  'image_size','image_height','image_width',
                  'saved_by','saved_by_cnt',)


    def get_saved_by(self,post):
        # request = self.context.get('request')
        # print("Context request:", request)
        context = self.context
        # if request is not None:
        #     context = {"request", request}
        users = post.saved_by.all()
        userinfo_objs = models.UserInfo.objects.filter(user__in=users).distinct()
        return SimpleUserInfoSerializer(userinfo_objs,many=True,context=context).data
    def get_saved_by_cnt(self,post):
        return post.saved_by.count()
    def get_image_width(self, obj):
        if obj.image:
            return obj.image.width
        return None
    def get_image_height(self, obj):
        if obj.image:
            return obj.image.height
        return None
    def get_image_size(self, obj):
        if obj.image:
            return obj.image.size
        return None
class SimpleCommentSerializer(serializers.ModelSerializer):
    user_userinfo = SimpleUserInfoSerializer(source="user.userinfo",read_only=True)
    class Meta:
        model = FluentComment
        fields = ('id','user_userinfo','comment')
        read_only_fields = ('id','user_userinfo','comment')
class PostCommentSerializer(serializers.ModelSerializer):

    # content_type = serializers.PrimaryKeyRelatedField(queryset=ContentType.objects.filter(app_label="common"),default=3)
    # site = serializers.PrimaryKeyRelatedField(queryset=Site.objects.all(),default=1)
    submit_date = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%S", required=False, read_only=True)
    user_userinfo = SimpleUserInfoSerializer(source="user.userinfo",read_only=True)
    voted_by = serializers.SerializerMethodField()
    total_vote = serializers.SerializerMethodField()
    children = serializers.SerializerMethodField()
    parent_top = serializers.SerializerMethodField()
    class Meta:
        model = FluentComment
        fields =('id','content_type','object_pk','user','comment','site','parent','parent_top','children','submit_date',
                 'user_userinfo','voted_by','total_vote',)
        read_only_fields = ('site','content_type','parent_top','children','submit_date',
                            'user_userinfo','voted_by','total_vote',)
    def get_voted_by(self,comment):
        return [vote.by.pk for vote in comment.votes.all()]
    def get_total_vote(self,comment):
        total = comment.votes.all().aggregate(Sum('vote'))['vote__sum'] or 0
        return total
    def get_children(self,comment):
        return PostCommentSerializer(comment.children.all(),many=True,context=self.context).data
    def get_parent_top(self,comment):
        # get the top level parent
        cur = comment
        while cur.parent:
            cur = cur.parent
            # print(cur)
        return SimpleCommentSerializer(cur,context=self.context).data

    def create(self, validated_data):
        validated_data['site'] = Site.objects.get(pk=1)
        validated_data['content_type'] = ContentType.objects.get_for_model(models.Post)
        return super(PostCommentSerializer, self).create(validated_data)

class ListPostCommentSerializer(PostCommentSerializer):
    # for the comments page.
    post = serializers.SerializerMethodField()
    class Meta:
        model = FluentComment
        fields = ('id', 'content_type', 'object_pk', 'user', 'comment', 'site', 'parent', 'children', 'submit_date',
                  'user_userinfo', 'voted_by', 'total_vote','post',)
        read_only_fields = ('site', 'content_type', 'children', 'submit_date',
                            'user_userinfo', 'voted_by', 'total_vote','post',)
    def get_post(self,comment):
        post = models.Post.objects.get(pk=comment.object_pk)
        return PostSerializer(post,context=self.context).data
    def get_children(self,comment):
        # don't get all children, only get first 3
        return PostCommentSerializer(comment.children.all()[:3],context=self.context,many=True).data
class PostSerializer(NoUpdateMixin,SimplePostSerializer):
    tags = SimpleMyTagSerializer(many=True,read_only=False)
    publish_date = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%S", required=False, read_only=True)
    uploader_info = SimpleUserInfoSerializer(source="uploader.userinfo",read_only=True)
    # ratings = RatingSerializer(many=True,read_only=True)
    rated_by = serializers.SerializerMethodField()
    score_avg = serializers.SerializerMethodField()
    score_cnt = serializers.SerializerMethodField()
    # comments = PostCommentSerializer(many=True,read_only=True)
    comments = serializers.SerializerMethodField()
    class Meta:
        model = models.Post
        fields = "__all__"
        no_update_fields = ('image','hash','uploader',)
    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user
        if user.is_authenticated:
            validated_data['uploader']=user
        return super(PostSerializer,self).create(validated_data)
    def get_score_avg(self,post):
        ratings = models.Rating.objects.filter(post=post)
        avg = ratings.aggregate(score_avg=Avg('score'))['score_avg']
        # print("Score avg:",avg)
        return avg
    def get_score_cnt(self,post):
        ratings = models.Rating.objects.filter(post=post)
        return ratings.count()
    def get_rated_by(self,post):
        return [x.by.id for x in post.ratings.all()]
    def get_comments(self,post):
        comments =  post.comments.filter(parent=None)
        return PostCommentSerializer(comments,context=self.context,many=True,read_only=True).data
class PostModifySerializer(TaggitSerializer,PostSerializer):
    tags = TagListSerializerField()
    class Meta:
        model = models.Post
        fields = "__all__"
        no_update_fields = ('image','hash','uploader',)

class UserInfoProfileSerializer(serializers.ModelSerializer):
    posts_fav = serializers.SerializerMethodField()
    posts_upload = serializers.SerializerMethodField()
    # stats_posts = serializers.SerializerMethodField()
    stats_likes = serializers.SerializerMethodField()
    stats_posts_score_avg = serializers.SerializerMethodField()
    stats_tags_fav = serializers.SerializerMethodField()
    stats_tags_upload = serializers.SerializerMethodField()
    class Meta:
        model = models.UserInfo
        fields = ('display_name','icon','slogan','id','profile_bg',
                  'posts_fav','posts_upload',
                  # 'stats_posts', # just calculate, no need to do this separately
                  'stats_likes','stats_posts_score_avg','stats_tags_fav','stats_tags_upload',
                  )
    def get_stats_likes(self,userinfo):
        user = userinfo.user
        posts = user.posts_uploaded.all()
        likes = 0
        for post in posts:
            likes += post.saved_by.count()
        return likes
    def get_stats_posts_score_avg(self,userinfo):
        user = userinfo.user
        posts = user.posts_uploaded.all()
        total_score = 0
        total_cnt = 0
        for post in posts:
            if post.ratings.exists():
                avg = post.ratings.aggregate(score_avg=Avg('score'))['score_avg']
                total_score+=avg
                total_cnt+=1
        if total_cnt == 0:
            return 0
        return total_score/total_cnt
    def extract_tags(self,posts_set):
        tagged_items_set = models.TaggedItem.objects.filter(id__in=posts_set)
        tags = models.MyTag.objects.filter(tagged_items__in=tagged_items_set).distinct()
        tags = tags.annotate(fav_cnt=Count('tagged_items',filter=Q(tagged_items__in=tagged_items_set)))
        tags = tags.order_by("-fav_cnt")
        tags_set = set()
        CATEGORIES = ["general","artist","copyright","character","uncategorized",]
        for cat in CATEGORIES:
            tags_cat = tags.filter(category=cat)
            tags_set.update(tags_cat[:5])
        return SimpleMyTagSerializer(tags_set,many=True,context=self.context).data
    def get_stats_tags_fav(self,userinfo):
        user = userinfo.user
        posts_fav = user.saved_posts.all()
        return self.extract_tags(posts_fav)
    def get_stats_tags_upload(self,userinfo):
        user = userinfo.user
        posts_upload = user.posts_uploaded.all()
        return self.extract_tags(posts_upload)
    def get_posts_fav(self,userinfo):
        # get all the posts whose saved_by has user of this object
        user = userinfo.user
        # posts_fav = models.Post.objects.filter(saved_by=user).distinct()[:15]
        posts_fav = user.saved_posts.all()[:15]
        return SimplePostSerializer(posts_fav,context=self.context,many=True).data
    def get_posts_upload(self,userinfo):
        user = userinfo.user
        posts_upload = user.posts_uploaded.all()[:15]
        return SimplePostSerializer(posts_upload,context=self.context,many=True).data

