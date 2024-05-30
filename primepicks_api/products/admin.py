from django.contrib import admin
from .models import Product, ProductImage, Review

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1

class ProductAdmin(admin.ModelAdmin):
    list_display = ['title', 'price', 'rating']
    inlines = [ProductImageInline]
    fieldsets = (
        (None, {
            'fields': ('title', 'categories', 'description', 'price', 'rating', 'image')
        }),
        ('Custom Fields', {
            'fields': ('details', 'about'),
        }),
    )

admin.site.register(Product, ProductAdmin)
admin.site.register(ProductImage)
admin.site.register(Review)





