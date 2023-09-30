from django.urls import path,include
from django.urls import URLResolver,URLPattern
from . import views
from dj_rest_auth.views import LoginView,LogoutView,UserDetailsView
from dj_rest_auth.registration.views import RegisterView,VerifyEmailView
app_name = "common"
import dj_rest_auth.registration.urls
urlpatterns = [
    path("api",include("common.api.urls")),

]
