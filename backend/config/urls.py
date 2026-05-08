from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/exercises/', include('exercises.urls')),
    path('api/workouts/', include('workouts.urls')),
    path('api/feedbacks/', include('feedbacks.urls')),
]