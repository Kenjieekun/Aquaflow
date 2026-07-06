from django.urls import path

from .api_views import (
    ProductAPIView,
    OrderAPIView,
    CustomerAPIView
)

urlpatterns = [

    path(
        "products/",
        ProductAPIView.as_view(),
        name="api_products"
    ),

    path(
        "orders/",
        OrderAPIView.as_view(),
        name="api_orders"
    ),

    path(
        "customers/",
        CustomerAPIView.as_view(),
        name="api_customers"
    ),

]