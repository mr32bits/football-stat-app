from django.urls import path
from .views import *

urlpatterns = [
    path('seasons/', get_seasons, name='get_seasons'),
    path('seasons/create/', create_season, name='create_season'),
    path('seasons/<int:pk>', season_detail, name='season_detail'),
]