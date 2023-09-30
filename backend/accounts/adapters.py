from allauth.account.adapter import DefaultAccountAdapter
from allauth.account import app_settings
from allauth.utils import import_attribute
from django.conf import settings
class MyAccountAdapter(DefaultAccountAdapter):
    def get_email_confirmation_url(self, request, emailconfirmation):
        url = settings.FRONTEND_URL + "email-confirm/?key=" + emailconfirmation.key
        print("Email confirmation url:",url)
        return url
    # def send_mail(self, template_prefix, email, context):
    #     print("Context:",context)
    #     return super().send_mail(template_prefix, email, context)
def get_adapter(request=None):
    """
    The Adapter in app_settings.ADAPTER is set to CustomAccountAdapter.
    """
    return import_attribute(settings.ADAPTER)(request)