# Create your views here.
from django.db import transaction
from rest_framework import status
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, ViewSet
from rest_framework.authtoken.models import Token
from restaurant.models import Restaurant, Ticket

from restaurant.serializers import SignupSerializer, UserSerializer, RestaurantSerializer, RestaurantModelSerializer, \
    TicketModelSerializer, TicketSerializer


class SignupViewSet(ModelViewSet):
    authentication_classes = ()
    permission_classes = (AllowAny,)
    serializer_class = SignupSerializer
    http_method_names = ['post']


class LoginViewSet(ViewSet):
    """Based on rest_framework.authtoken.views.ObtainAuthToken"""
    serializer_class = AuthTokenSerializer
    permission_classes = (AllowAny,)

    def create(self, request):
        try:
            serializer = AuthTokenSerializer(
                data=request.data,
                context={'request': request}
            )
            serializer.is_valid(raise_exception=True)
            user = serializer.validated_data['user']

            token, created = Token.objects.get_or_create(user=user)
            user_serializer = UserSerializer(user)
            return Response({'token': token.key, 'user': user_serializer.data})
        except Exception as e:
            return Response({"code": e.args[0]}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RestaurantViewSet(ModelViewSet):
    permission_classes = (IsAuthenticated,)
    serializer_class = RestaurantModelSerializer

    def get_object(self):
        obj = Restaurant.objects.get(id=self.kwargs["pk"], owner=self.request.user)
        return obj

    def get_queryset(self):
        obj = Restaurant.objects.filter(owner=self.request.user)
        return obj


class TicketViewSet(ModelViewSet):
    queryset = Ticket.objects.all()
    permission_classes = (IsAuthenticated,)
    serializer_class = TicketModelSerializer

    def get_object(self):
        obj = Ticket.objects.get(id=self.kwargs["pk"])
        return obj

    def get_queryset(self):
        restaurant = Restaurant.objects.get(id=self.request.query_params['restaurant_id'], owner=self.request.user)
        obj = Ticket.objects.filter(restaurant=restaurant)
        return obj


class PurchasedTicketViewSet(ModelViewSet):
    queryset = Ticket.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = TicketModelSerializer

    def get_object(self):
        obj = Ticket.objects.get(ticket_coupon=self.kwargs["pk"])
        return obj

    def create(self, request, *args, **kwargs):
        try:
            with transaction.atomic():
                ticket = (Ticket.objects.select_for_update().get(ticket_coupon=request.query_params['ticket_coupon']))
                if ticket.max_purchase != ticket.sell_out:
                    ticket.sell_out += 1
                    ticket.save()
                    return Response({'status': 'ticket purchased'}, status=status.HTTP_200_OK)
                else:
                    return Response({'status': 'all tickets are sell out'}, status=status.HTTP_200_OK)
        except Exception as e:
            print(e.args)
            return Response({"code": e.args[0]}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RestaurantURLViewSet(ModelViewSet):
    queryset = Restaurant.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RestaurantModelSerializer

    def get_object(self):
        obj = Restaurant.objects.get(restaurants_url=self.kwargs["pk"])
        return obj
