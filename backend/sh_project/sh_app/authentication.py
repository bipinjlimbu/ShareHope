from rest_framework.authentication import CSRFCheck
from rest_framework.exceptions import AuthenticationFailed, PermissionDenied
from rest_framework_simplejwt.authentication import JWTAuthentication


def dummy_get_response(request):
    return None


class CookieJWTAuthentication(JWTAuthentication):
    from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.authentication import JWTAuthentication


class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        header = self.get_header(request)

        if header is not None:
            return super().authenticate(request)

        raw_token = request.COOKIES.get("access_token")

        if not raw_token:
            return None

        validated_token = self.get_validated_token(raw_token)

        try:
            user = self.get_user(validated_token)
        except AuthenticationFailed:
            raise

        return user, validated_token

    def enforce_csrf(self, request):
        check = CSRFCheck(dummy_get_response)
        check.process_request(request)

        reason = check.process_view(request, None, (), {})

        if reason:
            raise PermissionDenied(f"CSRF Failed: {reason}")
