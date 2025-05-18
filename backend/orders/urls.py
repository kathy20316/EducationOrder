
from django.urls import path
from .views import view_all_orders

app_name = 'orders'
# URL configuration for orders
urlpatterns = [
    path('', view_all_orders, name='view_all_orders'),
]
