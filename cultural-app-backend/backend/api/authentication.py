from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.authentication import CSRFCheck
from rest_framework import exceptions

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        access_token = request.COOKIES.get("access_token")
        if not access_token:
            return None 
        try:
            validated_token = self.get_validated_token(access_token)
        except Exception:
            return None
        return self.get_user(validated_token), validated_token