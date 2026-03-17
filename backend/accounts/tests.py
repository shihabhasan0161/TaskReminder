from django.test import TestCase
from .models import User

# Create your tests here.
class UserManagersTest(TestCase):

    def test_create_user(self):
        user = User.objects.create_user(
            email="test@example.com",
            password="admin123"
        )
        self.assertEqual(user.email, "test@example.com")
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)

        try:
            # username is None for the AbstractUser option
            self.assertIsNone(user.username)
        except AttributeError:
            pass

        with self.assertRaises(TypeError):
            User.objects.create_user()
        with self.assertRaises(TypeError):
            User.objects.create_user(email="")
        with self.assertRaises(ValueError):
            User.objects.create_user(email="", password="admin123")

    def test_create_superuser(self):
        admin_user = User.objects.create_superuser(
            email="superuser@example.com",
            password="admin123"
        )
        self.assertEqual(admin_user.email, "superuser@example.com")
        self.assertTrue(admin_user.is_active)
        self.assertTrue(admin_user.is_staff)
        self.assertTrue(admin_user.is_superuser)

        try:
            # username is None for the AbstractUser option
            self.assertIsNone(admin_user.username)
        except AttributeError:
            pass
        with self.assertRaises(ValueError):
            User.objects.create_superuser(
                email="superuser@example.com",
                password="admin123",
                is_superuser=False
            )