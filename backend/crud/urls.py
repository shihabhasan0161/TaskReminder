from django.urls import path
from .views import (
    TaskListCreateView,
    TaskDetailView,
    TaskCompleteView,
    GoogleCalendarAddEventView,
)
from .auth_views import GoogleLoginView

urlpatterns = [
    path("auth/google/", GoogleLoginView.as_view(), name="google-login"),
    path("tasks/", TaskListCreateView.as_view(), name="task-list"),
    path("tasks/<int:pk>/", TaskDetailView.as_view(), name="task-detail"),
    path("tasks/<int:pk>/complete/", TaskCompleteView.as_view(), name="task-complete"),
    path(
        "calendar/add-event/",
        GoogleCalendarAddEventView.as_view(),
        name="calendar-add-event",
    ),
]
