# Model: Order Model

from django.db import models
from django.contrib.auth.models import User

from django.db import models
from django.contrib.auth.models import User

class Order(models.Model):
    orderID = models.AutoField(primary_key=True)  # Auto-generated unique ID
    orderItem = models.CharField(max_length=255)  # Define an appropriate field
    orderDescription = models.TextField(blank=True, null=True)  # Optional description
    orderDate = models.DateTimeField(auto_now_add=True)  # Auto-set creation date

    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name="student_orders")
    tutor = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tutor_orders")
    
    subject = models.CharField(max_length=100)
    session_date = models.DateTimeField()

    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Completed', 'Completed'),
        ('Canceled', 'Canceled')
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')

    price = models.DecimalField(max_digits=6, decimal_places=2)

    def __str__(self):
        return f"Order {self.orderID}: {self.student.username} with {self.tutor.username} - {self.subject} ({self.status})"


