# Controller: Handles request to view all orders

from django.shortcuts import render
from django.http import HttpResponse
from orders.models import Order

def view_all_orders(request):
    orders = Order.objects.all()
    return render(request, 'orders/all_orders.html', {'orders': orders})
    


