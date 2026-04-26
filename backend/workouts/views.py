from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import WorkoutPlan
from .serializers import WorkoutPlanSerializer

@api_view(['GET'])
def get_workouts(request):
    workouts = WorkoutPlan.objects.all()
    serializer = WorkoutPlanSerializer(workouts, many=True)
    return Response(serializer.data)