from django.urls import path, include
from rest_framework.routers import DefaultRouter

from restaurant.views import SignupViewSet, LoginViewSet, RestaurantViewSet, PurchasedTicketViewSet, RestaurantURLViewSet, TicketViewSet

routers = DefaultRouter()
routers.register('signup', SignupViewSet, basename='signup')
routers.register('login', LoginViewSet, basename='login')
routers.register('restaurants', RestaurantViewSet, basename='restaurants')
routers.register('tickets', TicketViewSet, basename='tickets')
routers.register('purchase', PurchasedTicketViewSet, basename='purchase')
routers.register('restaurants_url', RestaurantURLViewSet, basename='purchase')


urlpatterns = [
    path('', include(routers.urls)),
]
