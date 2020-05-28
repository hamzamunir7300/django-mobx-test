from django.http import HttpRequest
from rest_framework import serializers
from django.contrib.auth import get_user_model

from restaurant.models import Restaurant, Ticket

User = get_user_model()


class SignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User(
            email=validated_data['email'],
            username=validated_data['username']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')


class RestaurantSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=256, required=True)


class RestaurantModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        exclude = ['updated_at', 'created_at']


class TicketSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=256)
    max_purchase = serializers.IntegerField(default=0)
    amount = serializers.IntegerField(default=0)


class TicketModelSerializer(serializers.ModelSerializer):
    restaurant_name = serializers.SerializerMethodField(read_only=True)
    restaurants_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Ticket
        fields = ['id', 'name', 'amount', 'max_purchase', 'sell_out', 'restaurant', 'ticket_coupon', 'restaurant_name',
                  'restaurants_url']

    def get_restaurant_name(self, obj):
        return obj.restaurant.name

    def get_restaurants_url(self, obj):
        return obj.restaurant.restaurants_url
