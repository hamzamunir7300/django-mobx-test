from django.db import models
from django.contrib.auth import get_user_model
from shortuuidfield import ShortUUIDField
# Create your models here.

User = get_user_model()


class Restaurant(models.Model):
    name = models.CharField(max_length=256)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    restaurants_url = ShortUUIDField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Ticket(models.Model):
    name = models.CharField(max_length=256)
    amount = models.IntegerField(null=True, default=0)
    max_purchase = models.IntegerField(default=0)
    sell_out = models.IntegerField(null=True, default=0)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    ticket_coupon = ShortUUIDField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
