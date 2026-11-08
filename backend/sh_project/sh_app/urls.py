from django.urls import path
from .views.auth_view import register_view, login_view, refresh_token_view, logout_view, csrf_token_view, verify_otp_view, resend_reset_otp_view
from .views.main_view import contact_view
from .views.profile_view import profile_view, verify_email_view, resend_otp_view
from .views.user_view import user_view, user_detail_view
from .views.ngo_view import ngo_by_user_view, ngo_view, ngo_detail_view, pending_ngo_change_view
from .views.campaign_view import campaign_view, campaign_detail_view, pending_campaign_change_detail_view, pending_campaign_change_view
from .views.testimonial_view import testimonial_view, testimonial_detail_view
from .views.notification_view import notification_view, notification_detail_view

urlpatterns = [
    path('register/', register_view, name='register'),
    path('register/ngo/', ngo_view, name='register_ngo'),
    path('login/', login_view, name='login'),
    path('login/resend-reset-otp/', resend_reset_otp_view, name='resend_reset_otp'),
    path('login/verify-otp/', verify_otp_view, name='verify_otp'),
    path('token/refresh/', refresh_token_view, name='token_refresh'),
    path('logout/', logout_view, name='logout'),
    path('csrf/', csrf_token_view, name='csrf_token'),
    path('contact/', contact_view, name='contact'),
    path('profile/', profile_view, name='profile'),
    path('profile/verify-email/', verify_email_view, name='verify_email'),
    path('profile/resend-otp/', resend_otp_view, name='resend_otp'),
    path('users/', user_view, name='users_list'),
    path('users/<int:pk>/', user_detail_view, name='user_detail'),
    path('ngo/', ngo_view, name='ngo_list'),
    path('ngo/user/', ngo_by_user_view, name='ngo_by_user'),
    path('ngo/<int:pk>/', ngo_detail_view, name='ngo_detail'),
    path('ngo/pending-change/', pending_ngo_change_view, name='pending_ngo_change'),
    path('campaign/', campaign_view, name='campaign_list'),
    path('campaign/<int:pk>/', campaign_detail_view, name='campaign_detail'),
    path('campaign/pending-change/', pending_campaign_change_view, name='pending_campaign_change'),
    path('campaign/pending-change/<int:pk>/', pending_campaign_change_detail_view, name='pending_campaign_change_detail'),
    path('testimonial/', testimonial_view, name='testimonial_list'),
    path('testimonial/<int:pk>/', testimonial_detail_view, name='testimonial_detail'),
    path('notification/', notification_view, name='notification_list'),
    path('notification/<int:pk>/', notification_detail_view, name='notification_detail'),
]