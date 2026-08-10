from django.urls import path
from . import views

urlpatterns = [
    path('', views.DomainListCreateView.as_view(), name='domain-list-create'),
    path('<int:pk>/', views.DomainDetailView.as_view(), name='domain-detail'),
    path('<int:pk>/credentials/', views.DomainCredentialDetailView.as_view(), name='domain-credential-detail'),
]