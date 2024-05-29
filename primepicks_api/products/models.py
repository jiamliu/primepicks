from django.db import models
from categories.models import Category
from django.contrib.auth.models import User

class Product(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='products/')
    rating = models.FloatField()
    categories = models.ManyToManyField(Category, related_name='products')

    def __str__(self):
        return self.title

class Review(models.Model):
    product = models.ForeignKey(Product, related_name='reviews', on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='reviews', on_delete=models.CASCADE)
    content = models.TextField()
    rating = models.IntegerField()

    def __str__(self):
        return f'Review for {self.product.title} by {self.user.username}'

class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='product_images/')  
    caption = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f'Image for {self.product.title}'
