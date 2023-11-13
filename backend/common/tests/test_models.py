from django.test import TestCase
from common import models
from django.contrib.auth import get_user_model
from allauth.account.models import EmailAddress
from django.db.utils import IntegrityError,DataError
from django.db import transaction
User = get_user_model()
class UserInfoTest1(TestCase):
    '''Testing UserInfo model'''
    def setUp(self) -> None:
        User.objects.create_user(
            email="test1@gmail.com",
            password="test1"
        )
        User.objects.create_user(
            email="super@gmail.com",
            password="superuser",
            is_superuser = True,
        )
    def test_normal_user(self):
        u1 = User.objects.get(email="test1@gmail.com")
        self.assertFalse(u1.is_staff)
        self.assertFalse(u1.is_superuser)
        self.assertTrue(u1.is_active)
        # not testing for email since usually it will be done through signup form
    def test_super_user(self):
        su = User.objects.get(email="super@gmail.com")
        self.assertFalse(su.is_staff) # a superuser doesn't have to be staff
        self.assertTrue(su.is_superuser)
        self.assertTrue(su.is_active)
        su_email = su.emailaddress_set.first()
        self.assertTrue(su_email.verified) # automatically set superuser's email to verified.
    def test_userinfo(self):
        '''Test if userinfo is created'''
        u1 = User.objects.get(email="test1@gmail.com")
        u1_info = u1.userinfo
        self.assertIsNotNone(u1_info)
        u1_info_user = u1_info.user
        self.assertEqual(u1,u1_info_user)
        '''Now modify that userinfo'''
        uname = "testUser1"
        uslogan = "Six started far placing saw respect females old."
        u1_info.display_name = uname
        u1_info.slogan = uslogan
        u1_info.save()
        self.assertEqual(u1_info.display_name,uname)
        self.assertEqual(u1_info.slogan,uslogan)
        '''Now test if prevent too long input'''
        u1_info.slogan = "Civilly why how end viewing attempt related enquire visitor. Man particular insensible celebrated conviction stimulated principles day. Sure fail or in said west. Right my front it wound cause fully am sorry if. She jointure goodness interest debating did outweigh. Is time from them full my gone in went. Of no introduced am literature excellence mr stimulated contrasted increasing. Age sold some full like rich new. Amounted repeated as believed in confined juvenile."
        with self.assertRaises(DataError):
            with transaction.atomic():
                u1_info.save() # should not pass
        u1 = User.objects.get(email="test1@gmail.com")
        with self.assertRaises(IntegrityError):
            with transaction.atomic():
                u1_info2 = models.UserInfo.objects.create(user=u1) # duplicate userinfo
