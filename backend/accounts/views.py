from dj_rest_auth.registration.views import RegisterView

from .serializers import CustomRegisterSerializer


class EmailRegisterView(RegisterView):
	serializer_class = CustomRegisterSerializer
