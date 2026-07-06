from django.db import models


class Product(models.Model):

    name = models.CharField(max_length=100)

    description = models.TextField()

    price = models.DecimalField(max_digits=10, decimal_places=2)

    stock = models.PositiveIntegerField()

    image = models.CharField(max_length=255)

    def __str__(self):

        return self.name


class Customer(models.Model):

    first_name = models.CharField(max_length=100)

    last_name = models.CharField(max_length=100)

    email = models.EmailField(unique=True)

    def __str__(self):

        return f"{self.first_name} {self.last_name}"


class Order(models.Model):

    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE
    )

    quantity = models.PositiveIntegerField()

    total = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    status = models.CharField(max_length=30)

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):

        return f"Order #{self.id}"