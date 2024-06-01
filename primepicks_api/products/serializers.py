from rest_framework import serializers
from .models import Product, Review, ProductImage
from categories.models import Category

class ProductImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'caption', 'image_url']

    def get_image_url(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(obj.image.url)

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'product', 'user', 'content', 'rating']

class ProductSerializer(serializers.ModelSerializer):
    reviews = ReviewSerializer(many=True, read_only=True)
    categories = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), many=True)
    images = ProductImageSerializer(many=True, read_only=True)
    details = serializers.JSONField()
    about = serializers.JSONField()

    class Meta:
        model = Product
        fields = ['id', 'title', 'description', 'price', 'rating', 'categories', 'reviews', 'images', 'details', 'about']

    def create(self, validated_data):
        categories = validated_data.pop('categories')
        product = Product.objects.create(**validated_data)
        product.categories.set(categories)
        return product

    def update(self, instance, validated_data):
        categories = validated_data.pop('categories')
        instance = super().update(instance, validated_data)
        instance.categories.set(categories)
        return instance





