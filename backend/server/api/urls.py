from django.urls import path
from .views import *

urlpatterns = [
    path('seasons/', Seasons.SeasonsGET.as_view()),
    path('seasons/create/', Seasons.SeasonsPOST.as_view()),
    path('seasons/<int:pk>', Seasons.SeasonsEDIT.as_view()),

    path('teams/', Teams.TeamsGET.as_view()),
    path('teams/create/', Teams.TeamsPOST.as_view()),
    path('teams/<int:pk>', Teams.TeamsEDIT.as_view()),
    
    path('matches/', Matches.MatchesGET.as_view()),
    path('matches/create/', Matches.MatchesPOST.as_view()),
    path('matches/<uuid:match_uuid>', Matches.MatchesEDIT.as_view()),
    
    path('players/', Players.PlayersGET.as_view()),
    path('players/create/', Players.PlayersPOST.as_view()),
    path('players/<uuid:player_uuid>', Players.PlayersEDIT.as_view()), 

    path('playermatches/', PlayerMatches.PlayerMatchesGET.as_view()),
    path('playermatches/create/', PlayerMatches.PlayerMatchesPOST.as_view()),
    #path('playermatches/<id>', PlayerMatches.PlayerMatchesEDIT.as_view()), 
]