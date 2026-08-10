from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Domain, DomainCredential
from .serializers import DomainCredentialSerializer, DomainSerializer


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


class DomainCredentialDetailView(generics.RetrieveUpdateDestroyAPIView):
  serializer_class = DomainCredentialSerializer
  permission_classes = [IsAuthenticated]
  lookup_field = 'pk'

  def get_queryset(self):
    return DomainCredential.objects.filter(domain__user=self.request.user)