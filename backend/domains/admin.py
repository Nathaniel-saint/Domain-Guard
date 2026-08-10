from django.contrib import admin
from .models import Domain, DomainCredential

# Register your models here.

class AdminDomain(admin.ModelAdmin):
    list_display =['domain_name', 'registrar', 'expiry_date', 'status', 'created_at']

admin.site.register(Domain, AdminDomain)

class AdminDomainCredential(admin.ModelAdmin):
    list_display =['registrar_username', 'registrar_password', 'api_secret_key']

admin.site.register(DomainCredential, AdminDomainCredential)