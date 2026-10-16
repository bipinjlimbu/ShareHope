from django.urls import path
from .views.auth_view import register_view, login_view, refresh_token_view, logout_view, csrf_token_view
from .views.profile_view import profile_view, verify_email_view

urlpatterns = [
    path('register/', register_view, name='register'),
    path('login/', login_view, name='login'),
    path('token/refresh/', refresh_token_view, name='token_refresh'),
    path('logout/', logout_view, name='logout'),
    path('csrf/', csrf_token_view, name='csrf_token'),
    path('profile/', profile_view, name='profile'),
    path('profile/verify-email/', verify_email_view, name='verify_email'),
]