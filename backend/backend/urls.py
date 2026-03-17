from django.contrib import admin
from django.urls import path, include

from accounts.views import EmailRegisterView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("crud.urls")),
    path("api/auth/", include("dj_rest_auth.urls")),
    path("api/auth/registration/", EmailRegisterView.as_view(), name="rest_register"),
    path("accounts/", include("allauth.urls")),
]
