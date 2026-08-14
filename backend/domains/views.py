from rest_framework import generics, status, serializers
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.exceptions import InvalidToken
from django.conf import settings

from .models import Domain, DomainCredential
from .serializers import DomainCredentialSerializer, DomainSerializer


class CookieTokenRefreshSerializer(TokenRefreshSerializer):
    refresh = serializers.CharField(required=False, allow_blank=True)

    def validate(self, attrs):
        request = self.context.get('request')
        cookie_name = getattr(settings, 'JWT_COOKIE_NAME', 'refresh_token')
        refresh_token = request.COOKIES.get(cookie_name) if request else None

        if not refresh_token:
            raise InvalidToken("No refresh token cookie provided.")

        attrs['refresh'] = refresh_token
        return super().validate(attrs)


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        refresh_token = data.get('refresh')
        access_token = data.get('access')

        response = Response({'access': access_token}, status=status.HTTP_200_OK)

        if refresh_token:
            response.set_cookie(
                key=getattr(settings, 'JWT_COOKIE_NAME', 'refresh_token'),
                value=refresh_token,
                httponly=getattr(settings, 'JWT_COOKIE_HTTPONLY', True),
                secure=getattr(settings, 'JWT_COOKIE_SECURE', False),
                samesite=getattr(settings, 'JWT_COOKIE_SAMESITE', 'Lax'),
                path='/',
            )

        return response


class CookieTokenRefreshView(TokenRefreshView):
    serializer_class = CookieTokenRefreshSerializer
    permission_classes = [AllowAny]


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