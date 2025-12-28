import pytest
import logging

logger = logging.getLogger(__name__)


@pytest.mark.django_db
def test_create_task(auth_client) -> None:
    """
    Test the create task API
    :param auth_client:
    :return: None
    """
    payload = {
        "title": "Do leetcode",
        "content": "Do the leetcode contains duplicate problem.",
    }

    response = auth_client.post(
        "/api/tasks/",
        data=payload,
        format="json",
    )

    logger.info(f"Response: {response.data}")

    assert response.status_code == 201  # 201 means created
    assert response.data["title"] == payload["title"]
