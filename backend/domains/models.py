from django.conf import settings
from django.db import models


class Domain(models.Model):
  STATUS_CHOICES = [
      ('ACTIVE', 'Active'),
      ('EXPIRING_SOON', 'Expiring Soon'),
      ('EXPIRED', 'Expired'),
  ]

  user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='domains',)
  domain_name = models.CharField(max_length=255, unique=True)
  registrar = models.CharField(max_length=100)
  expiry_date = models.DateField()
  status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
  created_at = models.DateTimeField(auto_now_add=True)

  class Meta:
    ordering = ['-created_at']

  def __str__(self):
    return self.domain_name


class DomainCredential(models.Model):
  domain = models.OneToOneField(Domain, on_delete=models.CASCADE, related_name='credentials')
  registrar_username = models.CharField(max_length=255, blank=True, null=True)
  registrar_password = models.CharField(max_length=255, blank=True, null=True)
  api_secret_key = models.TextField(blank=True, null=True)

  def __str__(self):
    return f'Vault for {self.domain.domain_name}'