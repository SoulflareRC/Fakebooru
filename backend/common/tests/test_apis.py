import logging

from django.test import TestCase,Client
from common import models
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from PIL import Image
from pathlib import Path
from allauth.account.models import EmailAddress
from django.db.utils import IntegrityError,DataError
from django.db import transaction
from ..api import serializers
User = get_user_model()
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework.request import Request
from rest_framework import status
'''
Testing serializers 
'''
# client = Client()
class PostTest(TestCase):
    '''Testing post model'''
    def setUp(self) -> None:
        u1 = User.objects.create_user(
            email="test1@gmail.com",
            password="test1"
        )
        u2 = User.objects.create_user(
            email="test2@gmail.com",
            password="test2"
        )
        u3 = User.objects.create_user(
            email="test3@gmail.com",
            password="test3"
        )
        User.objects.create_user(
            email="super@gmail.com",
            password="superuser",
            is_superuser=True,
        )
        tags = [
            "1girl","long_hair","smile","wallpaper","landscape","cityscape","4girls","red_hair","pink_hair","day","glasses","banishment",
        ]
        for tag in tags:
            models.MyTag.objects.create(name=tag)
        tags_list = [
            ("1girl","long_hair","smile"),
            ("cityscape","highway","wallpaper"),
            ("4girls", "long_hair", "red_hair","pink_hair"),
        ]
        users = User.objects.all()
        test_img_dir = Path("common/tests/assets/images")
        for idx, img in enumerate(test_img_dir.iterdir()):
            p = models.Post.objects.create(
                image=SimpleUploadedFile(img.name, content=open(img, 'rb').read(), content_type="image/jpeg"),
                uploader = users[idx]
            )
            tag_list = tags_list[idx]
            for t in tag_list:
                p.tags.add(t)
            # print(p.uploader)
            # break
        posts = models.Post.objects.all()
        p1 = models.Post.objects.get(pk=1)
        p1.saved_by.add(users[0])
        p1.saved_by.add(users[2])
        models.Rating.objects.create(post=p1,score=3,by=u1)
        models.Rating.objects.create(post=p1, score=2,by=u2)
        models.Rating.objects.create(post=p1, score=4, by=u3)

    def test_get_list(self):

        client = Client()
        '''Integration test'''
        '''verify if response data equal to serializer data'''

        '''posts list view'''
        url1 = reverse("post-list")
        response = client.get(url1)
        request = response.wsgi_request
        results = response.data.get("results")
        posts = models.Post.objects.all()
        serializer = serializers.SimplePostSerializer(posts,many=True,context={"request":request})
        self.assertEqual(serializer.data,results)
        self.assertEqual(response.status_code,status.HTTP_200_OK)

        unique_tags = response.data.get("unique_tags")
        tags = set()
        for post in posts:
            tags.update(post.tags.all().prefetch_related("tagged_items", "related", "related__tagged_items"))
        serializer = serializers.MyTagSerializer(tags, many=True, context={'request': request})
        self.assertEqual(serializer.data,unique_tags)
        self.assertEqual(response.status_code,status.HTTP_200_OK)

        '''post detail view '''
        url2 = reverse("post-detail",kwargs={"pk":1})
        response = client.get(url2)
        request = response.wsgi_request
        posts = models.Post.objects.get(pk=1)
        serializer = serializers.PostSerializer(posts,context={"request":request})
        self.assertEqual(serializer.data,response.data)
        self.assertEqual(response.status_code,status.HTTP_200_OK)

        url2 = reverse("post-detail", kwargs={"pk": 4})
        response = client.get(url2)
        self.assertEqual(response.status_code,status.HTTP_404_NOT_FOUND)

        '''Test response data correctness'''

        '''test simplepostserializer'''
        post = models.Post.objects.get(pk=1)
        url = reverse("post-list")
        response = client.get(url)
        post_data = response.data.get("results")[-1]
        self.assertIsNotNone(post_data.get("image"))
        self.assertTrue((str(post.image) in str(post_data.get("image"))))
        self.assertEqual(post.image.width,post_data.get("image_width"))
        self.assertEqual(post.image.height, post_data.get("image_height"))
        self.assertEqual(post.image.size, post_data.get("image_size"))
        self.assertEqual(2,post_data.get("saved_by_cnt"))
        self.assertIsNone(post_data.get("tags"))

        '''test postserializer'''
        url = reverse("post-detail",kwargs={"pk":1})
        response = client.get(url)
        request = response.wsgi_request
        post_data = response.data
        self.assertIsNotNone(post_data.get("image"))
        self.assertTrue((str(post.image) in str(post_data.get("image"))))
        self.assertEqual(post.image.width, post_data.get("image_width"))
        self.assertEqual(post.image.height, post_data.get("image_height"))
        self.assertEqual(post.image.size, post_data.get("image_size"))
        self.assertEqual(2, post_data.get("saved_by_cnt"))
        self.assertIsNotNone(post_data.get("tags"))
        tags = post.tags
        serializer =serializers.SimpleMyTagSerializer(tags,many=True,context={"request":request})
        self.assertTrue(serializer.data,post_data.get("tags"))
        uinfo = post.uploader.userinfo
        serializer = serializers.SimpleUserInfoSerializer(uinfo,context={"request":request})
        self.assertTrue(serializer.data,post_data.get("uploader_info"))
        self.assertEqual(3,post_data.get("score_avg"))
        self.assertEqual([1,2,3],post_data.get("rated_by"))
        self.assertEqual(3, post_data.get("score_cnt"))



