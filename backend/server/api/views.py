from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Season, Team, Player, Match, PlayerMatch
from .serializer import SeasonSerializer, TeamSerializer, PlayerSerializer, MatchSerializer, PlayerMatchSerializer

@api_view(['GET'])
def get_seasons(request):
    seasons = Season.objects.all()
    serializedData = SeasonSerializer(seasons, many=True).data
    return Response(serializedData)

@api_view(['POST'])
def create_season(request):
    data = request.data
    serializer = SeasonSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'DELETE'])
def season_detail(request, pk):
    try:
        season = Season.objects.get(pk=pk)
    except Season.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE':
        season.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    elif request.method == 'PUT':
        data = request.data
        serializer = SeasonSerializer(season, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)    
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
