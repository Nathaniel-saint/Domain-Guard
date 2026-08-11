from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView
from django.conf import settings

from .models import Domain, DomainCredential
from .serializers import DomainCredentialSerializer, DomainSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
  def post(self, request, *args, **kwargs):
    response = super().post(request, *args, **kwargs)
    refresh_token = response.data.get('refresh')

    if refresh_token:
      response.set_cookie(
        key=getattr(settings, 'JWT_COOKIE_NAME', 'refresh_token'),
        value=refresh_token,
        httponly=getattr(settings, 'JWT_COOKIE_HTTPONLY', True),
        secure=getattr(settings, 'JWT_COOKIE_SECURE', False),
        samesite=getattr(settings, 'JWT_COOKIE_SAMESITE', 'Lax'),
        path='/auth/api/token/refresh/',
      )
      del response.data['refresh']

    return response


class CookieTokenRefreshView(TokenRefreshView):
  def post(self, request, *args, **kwargs):
    refresh_token = request.COOKIES.get('refresh_token')
        
    if not refresh_token:
      return Response(
        {"detail": "No refresh token cookie provided."},
        status=status.HTTP_401_UNAUTHORIZED
      )
            
    request.data['refresh'] = refresh_token
    return super().post(request, *args, **kwargs)


class DomainListCreateView(generics.ListCreateAPIView):
  serializer_class = DomainSerializer
  permission_classes = [IsAuthenticated]

  def get_queryset(self):
    return Domain.objects.filter(user=self.request.user)

  def perform_create(self, serializer):
    serializer.save(user=self.request.user)


class DomainDetailView(generics.RetrieveUpdateDestroyAPIView):
  serializer_class = DomainSerializer
  permission_classes = [IsAuthenticated]
  lookup_field = 'pk'

  def get_queryset(self):
    return Domain.objects.filter(user=self.request.user)


class DomainCredentialListCreateView(generics.ListCreateAPIView):
  serializer_class = DomainCredentialSerializer
  permission_classes = [IsAuthenticated]

  def get_queryset(self):
    queryset = DomainCredential.objects.filter(domain__user=self.request.user)
    domain_id = self.request.query_params.get('domain')
    if domain_id:
      queryset = queryset.filter(domain_id=domain_id)
    return queryset

  def get_serializer_context(self):
    context = super().get_serializer_context()
    context['request'] = self.request
    return context


class DomainCredentialDetailView(generics.RetrieveUpdateDestroyAPIView):
  serializer_class = DomainCredentialSerializer
  permission_classes = [IsAuthenticated]
  lookup_field = 'pk'

  def get_queryset(self):
    return DomainCredential.objects.filter(domain__user=self.request.user)