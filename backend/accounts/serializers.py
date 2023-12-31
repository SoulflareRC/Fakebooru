from django.contrib.auth.tokens import default_token_generator
from django.contrib.sites.shortcuts import get_current_site
from django.urls.base import reverse
from allauth.account import app_settings
from allauth.account.adapter import get_adapter
from allauth.account.utils import user_pk_to_url_str, user_username
from allauth.utils import build_absolute_uri
from dj_rest_auth.forms import AllAuthPasswordResetForm
from dj_rest_auth.serializers import PasswordResetSerializer
from django.conf import settings
class CustomAllAuthPasswordResetForm(AllAuthPasswordResetForm):
    def save(self, request, **kwargs):
        current_site = get_current_site(request)
        email = self.cleaned_data['email']
        token_generator = kwargs.get('token_generator',
                                     default_token_generator)

        for user in self.users:

            temp_key = token_generator.make_token(user)

            # save it to the password reset model
            # password_reset = PasswordReset(user=user, temp_key=temp_key)
            # password_reset.save()

            # send the password reset email
            # path = reverse(
            #     'password_reset_confirm',
            #     args=[user_pk_to_url_str(user), temp_key],
            # )
            user_str = user_pk_to_url_str(user)
            path = settings.FRONTEND_URL + "accounts/password-reset-confirm/?"+"uid="+user_str+"&token="+temp_key
            url = build_absolute_uri(None, path) # PASS NONE INSTEAD OF REQUEST

            context = {
                'current_site': current_site, #current_site,
                'user': user,
                'password_reset_url': url,
                'request': request,
            }
            if app_settings.AUTHENTICATION_METHOD != app_settings.AuthenticationMethod.EMAIL:
                context['username'] = user_username(user)
            get_adapter(request).send_mail('account/email/password_reset_key',
                                           email, context)
        return self.cleaned_data['email']

class MyPasswordResetSerializer(PasswordResetSerializer):
    @property
    def password_reset_form_class(self):
        return CustomAllAuthPasswordResetForm

# settings.py
REST_AUTH_SERIALIZERS = {
    'PASSWORD_RESET_SERIALIZER':
    'api.users.api.serializers.CustomPasswordResetSerializer',
}