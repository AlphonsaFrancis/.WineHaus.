from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('list/', views.list_products, name='list_products'),  # List all products
    path('details/<int:pk>/', views.product_details, name='product_details'),  # Retrieve product details
    path('delete/<int:pk>/', views.delete_product, name='delete_product'),  # Delete product
    path('create/', views.create_product, name='create_product'),  # Create product
    path('update/<int:pk>/', views.update_product, name='update_product'),  # Update product

    # path('list/', views.product_list, name='product-list'),         
    # path('create/', views.product_create, name='product-create'),
    # path('details/<int:pk>/', views.product_detail, name='product-detail'),
    # path('update/<int:pk>/', views.product_update, name='product-update'),
    # path('delete/<int:pk>/', views.product_delete, name='product-delete'),

    path('category-list/', views.category_list, name='category-list'),
    path('category-create/', views.category_create, name='category-create'),
    path('category-details/<int:pk>/', views.category_detail, name='category-detail'),
    path('category-update/<int:pk>/', views.category_update, name='category-update'),
    path('category-delete/<int:pk>/', views.category_delete, name='category-delete'),
    path('madeof-list/', views.madeof_list, name='madeof-list'),
    path('madeof-details/<int:madeof_id>/', views.madeof_detail, name='madeof-detail'),
    path('madeof-create/', views.madeof_create, name='madeof-create'),  # Create API
    path('madeof-update/<int:madeof_id>/', views.madeof_update, name='madeof-update'),  # Update API
    path('madeof-delete/<int:madeof_id>/', views.madeof_delete, name='madeof-delete'),  # Delete API
    path('country-list/', views.country_list, name='country-list'),
    path('country-create/', views.country_create, name='country-create'),
    path('country-detail/<int:pk>/', views.country_detail, name='country-detail'),
    path('country-update/<int:pk>/', views.country_update, name='country-update'), 
    path('country-delete/<int:pk>/', views.country_delete, name='country-delete'),  
    path('brand-list/', views.brand_list, name='brand-list'),
    path('brand-create/', views.brand_create, name='brand-create'), 
    path('brand-details/<int:pk>/', views.brand_detail, name='brand-detail'),
    path('brand-update/<int:pk>/', views.brand_update, name='brand-update'),
    path('brand-delete/<int:pk>/', views.brand_delete, name='brand-delete'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)