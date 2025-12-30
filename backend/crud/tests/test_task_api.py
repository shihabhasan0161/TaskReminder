import pytest
import logging

logger = logging.getLogger(__name__)


@pytest.mark.django_db
def test_create_task(auth_client) -> None:
    """
    Create task test
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


@pytest.mark.django_db
def test_delete_task(auth_client) -> None:
    """
    Delete task by id test
    """
    payload = {
        "title": "Temp task",
        "content": "This task will be deleted",
    }

    response = auth_client.post(
        "/api/tasks/",
        data=payload,
        format="json",
    )

    assert response.status_code == 201
    task_id = response.data["id"]

    delete_response = auth_client.delete(f"/api/tasks/delete/{task_id}/")

    logger.info(f"Delete response status: {delete_response.status_code}")

    assert delete_response.status_code == 204

@pytest.mark.django_db
def test_get_all_task(auth_client) -> None:
    """
    Get all tasks test
    """
    response = auth_client.get("/api/tasks/")
    assert response.status_code == 200
    assert isinstance(response.data, list)