import pytest

from django.contrib.auth import get_user_model
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
    User = get_user_model()
    return User.objects.create_user(email="test@example.com", password="test")


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
