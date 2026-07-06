from rest_framework import serializers


class ProductSerializer(serializers.Serializer):

    id = serializers.CharField()

    name = serializers.CharField()

    description = serializers.CharField()

    price = serializers.FloatField()

    stock = serializers.IntegerField()

    image = serializers.CharField()


class OrderSerializer(serializers.Serializer):

    id = serializers.CharField()

    userId = serializers.CharField(required=False, allow_null=True)

    productId = serializers.CharField()

    productName = serializers.CharField()

    quantity = serializers.IntegerField()

    price = serializers.FloatField()

    total = serializers.FloatField()

    deliveryDate = serializers.CharField(required=False)

    deliveryAddress = serializers.CharField(required=False)

    status = serializers.CharField()

    createdAt = serializers.JSONField(required=False)


class CustomerSerializer(serializers.Serializer):

    id = serializers.CharField()

    firstName = serializers.CharField()

    lastName = serializers.CharField()

    email = serializers.EmailField()