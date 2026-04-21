from django.urls import path
from .views import get_exercises

urlpatterns = [
    path('', get_exercises),
]