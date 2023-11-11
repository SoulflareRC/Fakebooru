from django.conf.urls import include
from django.urls import path
from django.contrib import admin
from django.conf.urls.static import static
from django.conf import settings
# import django_js_reverse.views
from rest_framework.routers import DefaultRouter
from common.routes import routes as common_routes
from dj_rest_auth.views import LoginView,LogoutView,UserDetailsView,PasswordResetView, PasswordResetConfirmView
from dj_rest_auth.registration.views import RegisterView,VerifyEmailView
from .views import password_reset_confirm_redirect,email_confirm_redirect
router = DefaultRouter()

routes = common_routes
for route in routes:
    router.register(route["regex"], route["viewset"], basename=route["basename"])
import allauth.account.urls
urlpatterns = [
    path("__debug__/", include("debug_toolbar.urls")),
    path("", include("common.urls"), name="common"),
    path("api/", include(router.urls), name="api"),
    # path("accounts/", include('allauth.urls')),
    path("admin/", admin.site.urls, name="admin"),
    # path("auth/",include("allauth.urls"),name="auth"),
    # path("jsreverse/", django_js_reverse.views.urls_js, name="js_reverse"),
    # path('api/user/',include("users.urls")),
    path("register/", include('dj_rest_auth.registration.urls')),
    path("login/", LoginView.as_view(), name="rest_login"),
    path("logout/", LogoutView.as_view(), name="rest_logout"),
    path("user/", UserDetailsView.as_view(), name="rest_user_details"),
    path("verify-email/", VerifyEmailView.as_view(), name="rest_verify_email"),
    path(
        "account-confirm-email/",
        VerifyEmailView.as_view(),
        name="account_confirm_email_sent",
    ),
    path(
        "account-confirm-email/<key>/",
        VerifyEmailView.as_view(),
        name="account_confirm_email",
    ),
    path("password/reset/", PasswordResetView.as_view(), name="rest_password_reset"),
    path(
            "password/reset/confirm/<str:uidb64>/<str:token>/",
            password_reset_confirm_redirect,
            name="password_reset_confirm",
        ),
    path("password/reset/confirm/", PasswordResetConfirmView.as_view(), name="rest_password_reset_confirm"),


]
urlpatterns += static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)
