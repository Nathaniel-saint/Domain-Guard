from django.urls import path
from . import views

urlpatterns = [
    # Domain Endpoints
    path('', views.DomainListCreateView.as_view(), name='domain-list-create'),
    path('<int:pk>/', views.DomainDetailView.as_view(), name='domain-detail'),

    # Credential Endpoints
    path('credentials/', views.DomainCredentialListCreateView.as_view(), name='domain-credential-list-create'),
    path('credentials/<int:pk>/', views.DomainCredentialDetailView.as_view(), name='domain-credential-detail'),
]