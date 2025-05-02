# We will write tests for the views in the orders app
from django.test import TestCase
from django.urls import reverse
from orders.models import Order
from django.contrib.auth.models import User

class ViewAllOrdersTest(TestCase):
    def setUp(self):
        # Create test users
        self.student1 = User.objects.create_user(username='AliceJohnson')
        self.tutor1 = User.objects.create_user(username='JohnDoe')
        self.student2 = User.objects.create_user(username='BobSmith')
        self.tutor2 = User.objects.create_user(username='JaneTaylor')

        # Create test orders
        Order.objects.create(orderID=1, orderItem='Math Tutoring Session', 
                             orderDescription='One-on-one tutoring session for algebra', 
                             student=self.student1, tutor=self.tutor1,
                             subject='Mathematics', status='Completed', price=50.00)
        Order.objects.create(orderID=2, orderItem='English Essay Assistance', 
                             orderDescription='Help with writing and editing an essay for high school English', 
                             student=self.student2, tutor=self.tutor2,
                             subject='English', status='Pending', price=30.00)
    
    def test_view_all_orders(self):
        response = self.client.get(reverse('view_all_orders'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Math Tutoring Session')
        self.assertContains(response, 'English Essay Assistance')
        self.assertContains(response, 'Completed')
        self.assertContains(response, 'Pending')

    def test_order_count(self):
        # Test the number of orders created
        order_count = Order.objects.count()
        self.assertEqual(order_count, 2)  # Two orders were created as above
