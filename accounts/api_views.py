from rest_framework.response import Response
from rest_framework.views import APIView

from water_refilling_system.firebase_admin import db

from .serializers import (
    ProductSerializer,
    OrderSerializer,
    CustomerSerializer,
)


class ProductAPIView(APIView):

    def get(self, request):

        search = request.GET.get("search", "").lower()
        stock = request.GET.get("stock", "")
        page = int(request.GET.get("page", 1))

        products = []

        for doc in db.collection("products").stream():

            product = doc.to_dict()
            product["id"] = doc.id

            products.append(product)

        # Search
        if search:

            products = [

                product

                for product in products

                if search in product.get("name", "").lower()

            ]

        # Filter
        if stock == "available":

            products = [

                product

                for product in products

                if product.get("stock", 0) > 0

            ]

        elif stock == "out":

            products = [

                product

                for product in products

                if product.get("stock", 0) == 0

            ]

        # Pagination
        per_page = 5

        total = len(products)

        start = (page - 1) * per_page
        end = start + per_page

        serializer = ProductSerializer(
            products[start:end],
            many=True
        )

        return Response({

            "page": page,
            "per_page": per_page,
            "total": total,

            "products": serializer.data

        })


class OrderAPIView(APIView):

    def get(self, request):

        orders = []

        for doc in db.collection("orders").stream():

            order = doc.to_dict()
            order["id"] = doc.id

            orders.append(order)

        serializer = OrderSerializer(
            orders,
            many=True
        )

        return Response(serializer.data)


class CustomerAPIView(APIView):

    def get(self, request):

        customers = []

        for doc in db.collection("users").stream():

            customer = doc.to_dict()
            customer["id"] = doc.id

            customers.append(customer)

        serializer = CustomerSerializer(
            customers,
            many=True
        )

        return Response(serializer.data)