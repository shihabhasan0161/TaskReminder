import pytest

from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken


@pytest.fixture
def api_client() -> APIClient:
    """
    Unauthenticated API Client
    """
    return APIClient()


@pytest.fixture
def user(db):
    """
    Test user
    """
    return User.objects.create_user(username="test", password="test")


@pytest.fixture
def jwt_token(user):
    """
    JWT Access tojen for the test user
    """
    refresh = RefreshToken.for_user(user)
    return str(refresh.access_token)


@pytest.fixture
def auth_client(jwt_token):
    """
    API client authenticated via JWT headers
    """
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {jwt_token}")
    return client
