from rest_framework.decorators import api_view, renderer_classes
from rest_framework.response import Response
from rest_framework.renderers import TemplateHTMLRenderer
from  rest_framework.mixins import CreateModelMixin, ListModelMixin, DestroyModelMixin, RetrieveModelMixin, UpdateModelMixin
from rest_framework import status
from rest_framework.generics import GenericAPIView

from .models import Season, Team, Player, Match, PlayerMatch
from .serializer import SeasonSerializer, TeamSerializer, PlayerSerializer, MatchSerializer, PlayerMatchSerializer
#region SEASONS
class Seasons:
    class SeasonsGET(GenericAPIView, ListModelMixin):
        queryset = Season.objects.all()
        serializer_class=SeasonSerializer

        def get(self, request, *args, **kwargs):
            return self.list(request, *args, **kwargs)
        
    class SeasonsPOST(GenericAPIView, CreateModelMixin):
        queryset = Season.objects.all()
        serializer_class=SeasonSerializer

        def post(self, request, *args, **kwargs):
            return self.create(request, *args, **kwargs)
        
    class SeasonsEDIT(GenericAPIView, RetrieveModelMixin, UpdateModelMixin, DestroyModelMixin):
        queryset = Season.objects.all()
        serializer_class=SeasonSerializer

        def get(self, request, *args, **kwargs):
            return self.retrieve(request, *args, **kwargs)
        def put(self,request,*args,  **kwargs):
            return self.update(request, *args, **kwargs)  
        def delete(self,request,*args,  **kwargs):
            return self.destroy(request, *args, **kwargs)
#endregion

#region TEAMS
class Teams():
    class TeamsGET(GenericAPIView, ListModelMixin):
        queryset = Team.objects.all()
        serializer_class=TeamSerializer

        def get(self, request, *args, **kwargs):
            return self.list(request, *args, **kwargs)
        
    class TeamsPOST(GenericAPIView, CreateModelMixin):
        queryset = Team.objects.all()
        serializer_class=TeamSerializer

        def post(self, request, *args, **kwargs):
            return self.create(request, *args, **kwargs)
        
    class TeamsEDIT(GenericAPIView, RetrieveModelMixin, UpdateModelMixin, DestroyModelMixin):
        queryset = Team.objects.all()
        serializer_class=TeamSerializer

        def get(self, request, *args, **kwargs):
            return self.retrieve(request, *args, **kwargs)
        def put(self,request,*args,  **kwargs):
            return self.update(request, *args, **kwargs)  
        def delete(self,request,*args,  **kwargs):
            return self.destroy(request, *args, **kwargs)
#endregion

#region PLAYERS
class Players():
    class PlayersGET(GenericAPIView, ListModelMixin):
        queryset = Player.objects.all()
        serializer_class=PlayerSerializer

        def get(self, request, *args, **kwargs):
            return self.list(request, *args, **kwargs)
        
    class PlayersPOST(GenericAPIView, CreateModelMixin):
        queryset = Player.objects.all()
        serializer_class=PlayerSerializer

        def post(self, request, *args, **kwargs):
            return self.create(request, *args, **kwargs)
        
    class PlayersEDIT(GenericAPIView, RetrieveModelMixin, UpdateModelMixin, DestroyModelMixin):
        queryset = Player.objects.all()
        serializer_class=PlayerSerializer
        lookup_field='player_uuid'

        def get(self, request, *args, **kwargs):
            return self.retrieve(request, *args, **kwargs)
        def put(self,request,*args,  **kwargs):
            return self.update(request, *args, **kwargs)  
        def delete(self,request,*args,  **kwargs):
            return self.destroy(request, *args, **kwargs)
#endregion

#region MATCHES
class Matches():
    class MatchesGET(GenericAPIView, ListModelMixin):
        queryset = Match.objects.all()
        serializer_class=MatchSerializer

        def get(self, request, *args, **kwargs):
            return self.list(request, *args, **kwargs)
        
    class MatchesPOST(GenericAPIView, CreateModelMixin):
        queryset = Match.objects.all()
        serializer_class=MatchSerializer

        def post(self, request, *args, **kwargs):
            return self.create(request, *args, **kwargs)
        
    class MatchesEDIT(GenericAPIView, RetrieveModelMixin, UpdateModelMixin, DestroyModelMixin):
        queryset = Match.objects.all()
        serializer_class=MatchSerializer
        lookup_field='match_uuid'

        def get(self, request, *args, **kwargs):
            return self.retrieve(request, *args, **kwargs)
        def put(self,request,*args,  **kwargs):
            return self.update(request, *args, **kwargs)  
        def delete(self,request,*args,  **kwargs):
            return self.destroy(request, *args, **kwargs)
#endregion

#region PLAYERMATCHES
class PlayerMatches():
    class PlayerMatchesGET(GenericAPIView, ListModelMixin):
        queryset = PlayerMatch.objects.all()
        serializer_class=PlayerMatchSerializer

        def get(self, request, *args, **kwargs):
            return self.list(request, *args, **kwargs)
        
    class PlayerMatchesPOST(GenericAPIView, CreateModelMixin):
        queryset = PlayerMatch.objects.all()
        serializer_class=PlayerMatchSerializer

        def post(self, request, *args, **kwargs):
            return self.create(request, *args, **kwargs)
        
    class PlayerMatchesEDIT(GenericAPIView, RetrieveModelMixin, UpdateModelMixin, DestroyModelMixin):
        queryset = PlayerMatch.objects.all()
        serializer_class=PlayerMatchSerializer

        def get(self, request, *args, **kwargs):
            return self.retrieve(request, *args, **kwargs)
        def put(self,request,*args,  **kwargs):
            return self.update(request, *args, **kwargs)  
        def delete(self,request,*args,  **kwargs):
            return self.destroy(request, *args, **kwargs)
#endregion
