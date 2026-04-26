from django.urls import path
from .views import get_workouts

urlpatterns = [
    path('', get_workouts),
]