from common import models
from fluent_comments.models import FluentComment
from django.db.models import Sum,Avg,Count
import django.core.files.uploadedfile
from django.views import generic
from rest_framework.views import APIView
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import filters,generics
from rest_framework.permissions import IsAuthenticated
from common.utils.deepdanbooru import suggestTags
from PIL import Image
from rest_framework.decorators import action
from . import backends,pagination,permissions,serializers
import json
'''Userinfo'''
class UserInfoProfileViewset(viewsets.ModelViewSet):
    queryset = models.UserInfo.objects.all()
    serializer_class =serializers.UserInfoProfileSerializer
    permission_classes = (permissions.UserInfoPermission,)
class UserInfoViewset(viewsets.ModelViewSet):
    queryset = models.UserInfo.objects.all()
    serializer_class =serializers.UserInfoSerializer
    permission_classes = (permissions.UserInfoPermission,)
    query_fields=('user',)
    # lookup_field = 'pk'
    filter_backends = (backends.QueryParamFilterBackend,)
    def update(self,request,*args,**kwargs):
        print(request.data)
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            print(serializer.errors)
        response = super(UserInfoViewset, self).update(request,*args,**kwargs)
        return response
    @action(methods=['get'],detail=False)
    def current(self,request,*args,**kwargs):
        user = request.user
        if user.is_authenticated:
            current_user_info = models.UserInfo.objects.get(user=user.pk)
            print(user.pk)
            print(current_user_info)
            print(self.serializer_class)
            return Response(self.get_serializer_class()(current_user_info,context={"request":request}).data)
        else:
            print("User not authenticated")
            return Response({
                "error":"User not authenticated"
            })

'''Posts'''

class PostViewSet( viewsets.ModelViewSet):

    queryset = models.Post.objects.all().order_by('-publish_date')\
        .annotate(score_avg=Avg('ratings__score')).annotate(saved_by_cnt=Count('saved_by')) # annotate is the way to make this into the ordering fields...

    # serializer_class =  PostSerializer
    filter_backends = (filters.SearchFilter, filters.OrderingFilter,
                       backends.PublishDateFilterBackend, backends.TagFilterBackend)
    search_fields = ['tags']
    ordering_fields = ['publish_date', 'score_avg','saved_by_cnt']
    pagination_class = pagination.StandardPagination
    permission_classes = (permissions.PostPermission,)
    def get_serializer_class(self):
        if self.action == 'list':
            return serializers.SimplePostSerializer
        if self.action in ('create','update','partial_update'):
            return serializers.PostModifySerializer
        return serializers.PostSerializer
    def get_paginated_response(self, data):
        response = super(PostViewSet, self).get_paginated_response(data)
        posts = self.paginate_queryset(self.filter_queryset(self.get_queryset()))
        # print("posts:",posts)
        tags = set()
        for post in posts:
            tags.update(post.tags.all())
        serializer =serializers.MyTagSerializer(tags, many=True,context={'request':self.request})
        response.data['unique_tags'] = serializer.data
        return response
    def update(self, request, *args, **kwargs):
        # print("Update")
        serializer = self.get_serializer_class()(data=request.data)
        if not serializer.is_valid():
            print(serializer.errors)
        response = super(PostViewSet, self).update(request, *args, **kwargs)
        return response

    def partial_update(self, request, *args, **kwargs):
        # print("Partial update")
        serializer = self.get_serializer_class()(data=request.data)
        if not serializer.is_valid():
            print(serializer.errors)
        response = super(PostViewSet, self).partial_update(request, *args, **kwargs)
        return response

    @action(detail=True,methods=['get'])
    def save(self,request,*args,**kwargs):
        post = self.get_object()
        serializer_class = self.get_serializer_class()
        if not request.user in post.saved_by.all():
            print("User ",request.user," saving post")
            post.saved_by.add(request.user)
        else:
            print("User ",request.user," unsaving post")
            post.saved_by.remove(request.user)
        post.save()

        return Response(request.user in post.saved_by.all(), status=status.HTTP_200_OK)
        # return serializer_class(post).data
    @action(detail=False,methods=['get'])
    def count(self,request,*args,**kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        return Response(queryset.count())

class RatingViewSet(viewsets.ModelViewSet):
    search_fields = ['by','post']
    queryset = models.Rating.objects.all()
    serializer_class =serializers.RatingSerializer
    filter_backends = (filters.SearchFilter,filters.OrderingFilter)
    permission_classes = (permissions.RatingPermission,)
'''Tags'''

class MyTagViewSet(viewsets.ModelViewSet):
    queryset = models.MyTag.objects.all().annotate(post_cnt=Count('tagged_items'))
    search_fields = ['name'] # this is vague partial match
    ordering_fields = ['date','post_cnt','name']
    query_fields = ['category','name']  # this only allows exact match
    permission_classes = (permissions.TagPermission,)
    # serializer_class = MyTagSerializer
    filter_backends = (filters.SearchFilter, filters.OrderingFilter, backends.QueryParamFilterBackend,)
    pagination_class =pagination. StandardPagination
    def get_serializer_class(self):
        if self.action == 'list':
            return serializers.SimpleMyTagSerializer
        return serializers.MyTagSerializer

    @action(detail=False, methods=['post'])
    def suggest(self, request, *args, **kwargs):
        tags = []
        img_file = request.FILES.get('image')
        if img_file:
            print("Image file:", img_file)
            img_file: django.core.files.uploadedfile.InMemoryUploadedFile
            img = Image.open(img_file)
            tags = suggestTags(img)
        return Response(status=status.HTTP_200_OK, data={
            'tags': tags
        })

    # def get(self,request,*args,**kwargs):
'''Comments'''
class CommentVoteViewSet(viewsets.ModelViewSet):
    # search_fields = ['by','comment']
    query_fields = ['by','comment']  # this only allows exact match
    queryset = models.CommentVote.objects.all()
    serializer_class =serializers. CommentVoteSerializer
    filter_backends = (filters.OrderingFilter, backends.QueryParamFilterBackend,)
    permission_classes = (permissions.RatingPermission,)
class CommentViewSet(viewsets.ModelViewSet):
    filter_backends = (
                       # backends.QueryParamFilterBackend,
                       filters.OrderingFilter,)
    serializer_class =serializers. PostCommentSerializer
    ordering_fields = ('submit_date',)
    queryset = FluentComment.objects.all().order_by('submit_date')
    permission_classes = (permissions.CommentPermission,)
    pagination_class = pagination.StandardPagination
    def get_queryset(self):
        if self.action=="list":
            return FluentComment.objects.filter(parent=None)
        return FluentComment.objects.all()
    def get_serializer_class(self):
        if self.action == "list":
            return serializers.ListPostCommentSerializer
        return serializers.PostCommentSerializer
    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            print(serializer.errors)
        return super(CommentViewSet, self).create(request, *args, **kwargs)
