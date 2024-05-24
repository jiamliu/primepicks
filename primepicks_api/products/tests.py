from django.test import TestCase
from .models import Product, Review
from django.contrib.auth.models import User

class ProductTestCase(TestCase):
    def setUp(self):
        self.product = Product.objects.create(title="Test Product", description="Test Description", price=10.00, rating=4.5)

    def test_product_creation(self):
        self.assertEqual(self.product.title, "Test Product")
        self.assertEqual(self.product.description, "Test Description")
        self.assertEqual(self.product.price, 10.00)
        self.assertEqual(self.product.rating, 4.5)

class ReviewTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create(username="testuser")
        self.product = Product.objects.create(title="Test Product", description="Test Description", price=10.00, rating=4.5)
        self.review = Review.objects.create(product=self.product, user=self.user, content="Great product!", rating=5)

    def test_review_creation(self):
        self.assertEqual(self.review.product, self.product)
        self.assertEqual(self.review.user, self.user)
        self.assertEqual(self.review.content, "Great product!")
        self.assertEqual(self.review.rating, 5)

