from django.utils import timezone
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from allauth.socialaccount.models import SocialToken
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from google.auth.transport.requests import Request

from .models import Task
from .serializers import TaskSerializer, GoogleCalendarEventSerializer


class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        is_completed = self.request.query_params.get("is_completed", None)

        queryset = Task.objects.filter(author=user)

        if is_completed is not None:
            is_completed_bool = is_completed.lower() == "true"
            queryset = queryset.filter(is_completed=is_completed_bool)

        return queryset

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(author=self.request.user)


class TaskCompleteView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            task = Task.objects.get(pk=pk, author=self.request.user)
        except Task.DoesNotExist:
            return Response(
                {"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND
            )

        is_completed = request.data.get("is_completed", True)
        task.is_completed = bool(is_completed)
        task.completed_at = timezone.now() if task.is_completed else None
        task.save(update_fields=["is_completed", "completed_at"])

        return Response(TaskSerializer(task).data)


class GoogleCalendarAddEventView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = GoogleCalendarEventSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            task = Task.objects.get(
                pk=serializer.validated_data["task_id"], author=request.user
            )
        except Task.DoesNotExist:
            return Response(
                {"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND
            )

        try:
            token = SocialToken.objects.get(
                account__user=request.user,
                account__provider="google",
            )

            credentials = Credentials(
                token=token.token,
                refresh_token=token.token_secret,
                token_uri="https://oauth2.googleapis.com/token",
                client_id=token.app.client_id,
                client_secret=token.app.secret,
            )

            if credentials.expired:
                if not credentials.refresh_token:
                    return Response(
                        {
                            "error": "Google session expired. Please re-login with Google."
                        },
                        status=status.HTTP_401_UNAUTHORIZED,
                    )
                credentials.refresh(Request())
                token.token = credentials.token
                if credentials.expiry:
                    token.expires_at = credentials.expiry
                token.save()

            service = build("calendar", "v3", credentials=credentials)

            event = {
                "summary": serializer.validated_data["summary"],
                "description": serializer.validated_data.get("description", ""),
                "start": {
                    "dateTime": serializer.validated_data["start_datetime"].isoformat(),
                    "timeZone": "UTC",
                },
                "end": {
                    "dateTime": serializer.validated_data["end_datetime"].isoformat(),
                    "timeZone": "UTC",
                },
                "reminders": {
                    "useDefault": False,
                    "overrides": [
                        {"method": "popup", "minutes": 30},
                    ],
                },
            }

            created_event = (
                service.events().insert(calendarId="primary", body=event).execute()
            )

            task.google_calendar_event_id = created_event["id"]
            task.save()

            return Response(
                {
                    "message": "Event added to Google Calendar",
                    "event_id": created_event["id"],
                    "event_link": created_event["htmlLink"],
                },
                status=status.HTTP_201_CREATED,
            )

        except SocialToken.DoesNotExist:
            return Response(
                {"error": "Google account not connected"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        except HttpError as e:
            return Response(
                {"error": f"Google Calendar API error: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
