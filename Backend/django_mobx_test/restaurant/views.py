# Create your views here.
from rest_framework import status
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, ViewSet
from rest_framework.authtoken.models import Token
from restaurant.models import Restaurant, Ticket
from rest_framework.decorators import action

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
            print("enter in create method")
            print(request.data)
            serializer = AuthTokenSerializer(
                data=request.data,
                context={'request': request}
            )
            serializer.is_valid(raise_exception=True)
            user = serializer.validated_data['user']
            print(user.id)
            print("after verification")

            token, created = Token.objects.get_or_create(user=user)
            user_serializer = UserSerializer(user)
            return Response({'token': token.key, 'user': user_serializer.data})
        except Exception as e:
            return Response({"code": e.args[0]}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RestaurantViewSet(ViewSet):
    permission_classes = [IsAuthenticated, ]
    serializer_class = RestaurantSerializer

    def create(self, request):
        try:
            serializer = RestaurantSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            restaurant = Restaurant(name=serializer.validated_data['name'], owner=request.user)
            restaurant.save()
            restaurant_data = RestaurantModelSerializer(restaurant)
            return Response({'data': restaurant_data.data}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"code": e.args[0]}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def list(self, request):
        try:
            restaurant = Restaurant.objects.filter(owner=request.user)
            restaurant_data = RestaurantModelSerializer(restaurant, many=True)
            return Response({'data': restaurant_data.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"code": e.args[0]}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def retrieve(self, request, pk=None):
        try:
            restaurant = Restaurant.objects.get(id=pk, owner=request.user)
            restaurant_data = RestaurantModelSerializer(restaurant)
            return Response({'data': restaurant_data.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"code": e.args[0]}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def destroy(self, request, pk=None):
        try:
            restaurant = Restaurant.objects.get(id=pk, owner=request.user)
            tickets = Ticket.objects.filter(restaurant=restaurant)
            for ticket in tickets:
                ticket.delete()

            restaurant.delete()
            return Response({'data': status.HTTP_200_OK}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"code": e.args[0]}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Tickets
    @action(detail=True, methods=['post'])
    def ticket(self, request, pk=None):
        try:
            serializer = TicketSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            restaurant = Restaurant.objects.get(id=pk,  owner=request.user)
            ticket = Ticket(name=serializer.validated_data['name'], amount=serializer.validated_data['amount'],
                            max_purchase=serializer.validated_data['max_purchase'], restaurant=restaurant)
            ticket.save()
            ticket_data = TicketModelSerializer(ticket)
            return Response({'data': ticket_data.data}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"code": e.args[0]}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['get'])
    def tickets(self, request, pk=None):
        try:
            restaurant = Restaurant.objects.get(id=pk, owner=request.user)
            tickets = Ticket.objects.filter(restaurant=restaurant)
            ticket_data = TicketModelSerializer(tickets, many=True)
            return Response({'data': ticket_data.data}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"code": e.args[0]}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['delete'])
    def ticket_id(self, request, pk=None):
        try:
            restaurant = Restaurant.objects.get(id=pk, owner=request.user)
            tickets = Ticket.objects.get(id=request.query_params['id'], restaurant=restaurant)
            tickets.delete()
            return Response({'data': status.HTTP_200_OK}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"code": e.args[0]}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['get'])
    def specific_ticket(self, request, pk=None):
        try:
            restaurant = Restaurant.objects.get(id=pk, owner=request.user)
            tickets = Ticket.objects.get(id=request.query_params['id'], restaurant=restaurant)
            ticket_data = TicketModelSerializer(tickets)
            return Response({'data': ticket_data.data}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"code": e.args[0]}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PurchasedTicketViewSet(ViewSet):
    permission_classes = (AllowAny, )

    def list(self, request):
        try:
            tickets = Ticket.objects.all()
            ticket_data = TicketModelSerializer(tickets, many=True)
            return Response({'data': ticket_data.data}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"code": e.args[0]}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def retrieve(self, request, pk=None):
        try:
            ticket = Ticket.objects.get(ticket_coupon=pk)
            ticket_data = TicketModelSerializer(ticket)
            return Response({'data': ticket_data.data}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"code": e.args[0]}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def create(self, request):
        try:
            ticket = Ticket.objects.get(ticket_coupon=request.data['ticket_coupon'])
            if ticket.max_purchase != ticket.sell_out:
                ticket.sell_out += 1
                ticket.save()
                return Response({'status': 'ticket purchased'}, status=status.HTTP_200_OK)
            else:
                return Response({'status': 'all tickets are sell out'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"code": e.args[0]}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RestaurantURLViewSet(ViewSet):
    permission_classes = (AllowAny,)

    def retrieve(self, request, pk=None):
        try:
            restaurant = Restaurant.objects.get(restaurants_url=pk)
            restaurant_data = RestaurantModelSerializer(restaurant)
            return Response({'data': restaurant_data.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"code": e.args[0]}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)