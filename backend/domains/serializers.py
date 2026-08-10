from rest_framework import serializers
from .models import Domain, DomainCredential


class DomainCredentialSerializer(serializers.ModelSerializer):
  class Meta:
    model = DomainCredential
    fields = ['id', 'registrar_username', 'registrar_password', 'api_secret_key']


class DomainSerializer(serializers.ModelSerializer):
  credentials = DomainCredentialSerializer(read_only=True)

  class Meta:
    model = Domain
    fields = [ 'id', 'domain_name', 'registrar', 'expiry_date', 'status', 'created_at', 'credentials']
    read_only_fields = ['id', 'created_at']