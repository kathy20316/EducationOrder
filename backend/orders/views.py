# Controller: Handles request to view all orders

from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .models import Order

from django.contrib.auth.decorators import login_required
from django.shortcuts import render

# # FIX SECURITY ISSUE:
# # Direct access is not allowed without logging in properly
# @login_required(login_url='/login/')

def view_all_orders(request):

    # # FIX SECURITY ISSUE:
    # # Check if the user is authenticated
    # if not request.user.is_authenticated:
    #     return HttpResponse("Unauthorized", status=401)
    
    # If the user is authenticated, proceed to fetch and display orders
    orders = Order.objects.all()
    
    ## Instead of rendering a template, we will return a simple HttpResponse with JSON data

    # # Option 1: Render a template
    # return render(request, 'orders/all_orders.html', {'orders': orders})

    # Option 2: Return JSON response
    # Instead of rendering a template, we will return a simple HttpResponse with JSON data

    orders_data = [
        {
            "id": order.orderID,
            "item": order.orderItem,
            "description": order.orderDescription,
            "date": order.orderDate,
            "student": order.student.username,
            "tutor": order.tutor.username,
            "subject": order.subject,
            "status": order.status,
            "price": float(order.price),
        }
        for order in orders
    ]
    return JsonResponse({"orders": orders_data})


def home(request):
    return HttpResponse("Welcome to the Education Order Project!")
    


