from django.urls import path
from .views import get_feedbacks

urlpatterns = [
    path('', get_feedbacks),
]