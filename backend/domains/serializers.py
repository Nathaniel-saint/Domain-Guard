from rest_framework import serializers
from .models import Domain, DomainCredential

class DomainCredentialSerializer(serializers.ModelSerializer):
  domain = serializers.PrimaryKeyRelatedField(queryset=Domain.objects.all())

  class Meta:
    model = DomainCredential
    fields = ['id', 'domain', 'registrar_username', 'registrar_password', 'api_secret_key']

  def validate_domain(self, value):
    request = self.context.get('request')
    if request and value.user != request.user:
      raise serializers.ValidationError("You do not own this domain.")
    return value

class DomainSerializer(serializers.ModelSerializer):
  credentials = DomainCredentialSerializer(read_only=True)

  class Meta:
    model = Domain
    fields = ['id', 'domain_name', 'registrar', 'expiry_date', 'status', 'created_at', 'credentials']
    read_only_fields = ['id', 'created_at']