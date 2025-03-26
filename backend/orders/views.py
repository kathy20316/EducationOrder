# Controller: Handles request to view all orders

from django.shortcuts import render
from . import views
from django.http import HttpResponse

def view_all_orders(request):
    # orders = Order.objects.all()
    # return render(request, 'orders/all_orders.html', {'orders': orders})
    return render(request, 'orders/all_orders.html')
    

