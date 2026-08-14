from django.urls import path
from . import views

urlpatterns = [
    # doamin_endpoint
    path('', views.DomainListCreateView.as_view(), name='domain-list-create'),
    path('<int:pk>/', views.DomainDetailView.as_view(), name='domain-detail'),

    # credential_endpoint
    path('credentials/', views.DomainCredentialListCreateView.as_view(), name='domain-credential-list-create'),
    path('credentials/<int:pk>/', views.DomainCredentialDetailView.as_view(), name='domain-credential-detail'),
]