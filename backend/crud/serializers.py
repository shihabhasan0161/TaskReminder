from rest_framework import serializers
from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = [
            "id",
            "title",
            "content",
            "created_at",
            "updated_at",
            "due_date",
            "is_completed",
            "completed_at",
            "google_calendar_event_id",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
            "completed_at",
            "google_calendar_event_id",
        ]


class TaskCompletionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ["is_completed"]


class GoogleCalendarEventSerializer(serializers.Serializer):
    task_id = serializers.IntegerField()
    summary = serializers.CharField(max_length=200)
    description = serializers.CharField(required=False, allow_blank=True)
    start_datetime = serializers.DateTimeField()
    end_datetime = serializers.DateTimeField()
