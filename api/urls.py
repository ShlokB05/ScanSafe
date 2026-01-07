from django.urls import path
from .views import RegisterView, LoginView, LogoutView, ProfileView, ScanView, ChangePasswordView, MeView, CsrfView

urlpatterns = [
    path("auth/register/", RegisterView.as_view()),
    path("auth/login/", LoginView.as_view()),
    path("auth/logout/", LogoutView.as_view()),
    path("auth/me/", MeView.as_view()),
     path("auth/csrf/", CsrfView.as_view()),
    path("auth/change-password/", ChangePasswordView.as_view()),
    path("profile/", ProfileView.as_view()),
    path("scan/", ScanView.as_view()),
]