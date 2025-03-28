
from django.urls import path
from .views import view_all_orders

# URL configuration for orders
urlpatterns = [
    path('all/', view_all_orders, name='view_all_orders'),
]
