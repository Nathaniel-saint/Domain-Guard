from django.shortcuts import render
from rest_framework import generics
from .models import CustomUser
from .serializers import CustomUserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
# Create your views here.

class CreateUser(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes=[AllowAny]
    
