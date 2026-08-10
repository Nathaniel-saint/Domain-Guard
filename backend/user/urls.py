from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views
urlpatterns = [
    path('register/', views.CreateUser.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh')
]