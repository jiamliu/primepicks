from django.db import models
from users.models import UserProfile
from products.models import Product

class Order(models.Model):
    user_profile = models.ForeignKey(UserProfile, related_name='orders', on_delete=models.CASCADE)
    order_date = models.DateTimeField(auto_now_add=True)
    shipping_address = models.CharField(max_length=255)

    def __str__(self):
        return f"Order {self.id} by {self.user_profile.user.username}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name='order_items', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.quantity} x {self.product.title} (Order {self.order.id})"
