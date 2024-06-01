from rest_framework import viewsets
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.authentication import JWTAuthentication  # Import JWTAuthentication
from .models import Product, Review
from .serializers import ProductSerializer, ReviewSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['price', 'rating']

    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(categories__id=category)
        return queryset

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    authentication_classes = [JWTAuthentication]

    def perform_create(self, serializer):
        product_id = self.request.data.get('product')
        user = self.request.user

        if not user.is_authenticated:
            raise ValidationError("Authentication credentials were not provided.")

        if Review.objects.filter(product_id=product_id, user=user).exists():
            raise ValidationError("You have already reviewed this product.")

        serializer.save(user=user)
























    