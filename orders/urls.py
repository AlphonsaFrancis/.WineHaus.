from django.urls import path
from . import views

urlpatterns = [
    path('list/', views.order_list, name='order_list'),
    path('details/<int:pk>/', views.order_detail, name='order_detail'),
    path('items-list/', views.order_items_list, name='order_items_list'),
    path('items-detail/<int:pk>/', views.order_item_detail, name='order_item_detail'),
    path('wishlist-list/', views.wishlist_list, name='wishlist_list'),
    path('wishlist-detail/<int:pk>/', views.wishlist_detail, name='wishlist_detail'),
    path('wishlist-items-list/', views.wishlist_items_list, name='wishlist_items_list'),
    path('wishlist-items-details/<int:pk>/', views.wishlist_item_detail, name='wishlist_item_detail'),
    path('cart-list/', views.cart_list_create, name='cart-list-create'),
    path('carts-detail/<int:pk>/', views.cart_detail, name='cart-detail'),
    path('cart-items-create/', views.cart_items_list_create, name='cart-items-list-create'),
    path('cart-items-detail/<int:pk>/', views.cart_items_detail, name='cart-items-detail'),
    path('payment-list-create/', views.payment_list_create, name='payment-list-create'),
    path('payment-detail/<int:pk>/', views.payment_detail, name='payment-detail'),
    path('payments/create/', views.payment_create, name='payment-create'),
    path('payments/<int:pk>/update/', views.payment_update, name='payment-update'),
    path('payments/<int:pk>/delete/', views.payment_delete, name='payment-delete'),
    path('address-list/', views.address_list, name='address-list'),
    path('address-detail/<int:pk>/', views.address_detail, name='address-detail'),
    path('addresses/create/', views.create_address, name='address-create'),
    path('addresses/<int:pk>/update/', views.update_address, name='address-update'),
    path('addresses/<int:pk>/delete/', views.delete_address, name='address-delete'),
    path('shipping-list/', views.shipping_list, name='shipping-list'),
    path('shippings-details/<int:pk>/', views.shipping_detail, name='shipping-detail'),
    path('shippings-create/', views.shipping_create, name='shipping-create'),
    path('shippings-update/<int:pk>/update/', views.shipping_update, name='shipping-update'),
    path('shippings-delete/<int:pk>/delete/', views.shipping_delete, name='shipping-delete'),
]



