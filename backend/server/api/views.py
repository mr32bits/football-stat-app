from django.shortcuts import get_object_or_404
from django.db.models import Count, Sum

from rest_framework.mixins import CreateModelMixin, ListModelMixin, DestroyModelMixin, RetrieveModelMixin, UpdateModelMixin
from rest_framework.generics import GenericAPIView, ListAPIView
from rest_framework.views import APIView

from rest_framework.response import Response
from rest_framework import status

from .models import Season, Team, Player, Match, PlayerMatch
from .serializer import PlayerMiniSerializer, SeasonSerializer, TeamSerializer, PlayerSerializer, MatchSerializer, PlayerMatchSerializer, PlayerStatsSerializer

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
    class PlayersGET(GenericAPIView, ListModelMixin, DestroyModelMixin):
        queryset = Player.objects.all()
        serializer_class=PlayerSerializer

        def get(self, request, *args, **kwargs):
            return self.list(request, *args, **kwargs)
        def delete(self, request, *args, **kwargs):
            ids = request.data.get("player_ids", [])
            deleted_count, _ = Player.objects.filter(id__in=ids).delete()
            return Response({"deleted": deleted_count}, status=status.HTTP_200_OK)
        
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
            match = get_object_or_404(Match, match_uuid=kwargs.get("match_uuid"))
            player_matches = PlayerMatch.objects.filter(match=match).select_related("player", "team")
            serializer = PlayerMiniSerializer(player_matches, many=True)

            response_data = {}
            response_data['players'] = serializer.data
            response_data['match'] = MatchSerializer(match).data

            return Response(response_data, status=status.HTTP_200_OK)
        
        def put(self,request,*args,  **kwargs):
            match = self.get_object()
            serializer = self.get_serializer(match, data=request.data, partial=False)

            if serializer.is_valid():
                serializer.save()

                # --- Handle player associations ---
                team1_players = request.data.get("team1Players", [])
                team2_players = request.data.get("team2Players", [])

                # Initialize goal counters
                team1_goals = 0
                team2_goals = 0

                # Wipe out old player associations (optional but safer to sync)
                PlayerMatch.objects.filter(match=match).delete()


                print(f"team1_players: {team1_players}")
                print(f"team2_players: {team2_players}")

                # Create new PlayerMatch entries for team 1
                for player_data in team1_players:
                    player_id = player_data.get("player_id")
                    if player_id:
                        player = get_object_or_404(Player, id=player_id)
                        goals = int(player_data.get("goals_scored", 0))
                        own_goals = int(player_data.get("own_goals_scored", 0))
                        PlayerMatch.objects.create(
                            player=player,
                            match=match,
                            team=match.team1,
                            goals_scored=goals,
                            own_goals_scored=own_goals,
                        )
                        # Update team goals
                        team1_goals += goals
                        team2_goals += own_goals

                # Create new PlayerMatch entries for team 2
                for player_data in team2_players:
                    player_id = player_data.get("player_id")
                    if player_id:
                        player = get_object_or_404(Player, id=player_id)
                        goals = int(player_data.get("goals_scored", 0))
                        own_goals = int(player_data.get("own_goals_scored", 0))
                        PlayerMatch.objects.create(
                            player=player,
                            match=match,
                            team=match.team2,
                            goals_scored=goals,
                            own_goals_scored=own_goals,
                        )
                        team2_goals += goals
                        team1_goals += own_goals

                match.team1_score = team1_goals
                match.team2_score = team2_goals
                match.save(update_fields=["team1_score", "team2_score"])

                return Response({"message": "Match and players updated successfully.",
                                  "team1_score": match.team1_score,
                                  "team2_score": match.team2_score,}
                                  , status=status.HTTP_200_OK)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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

#region PLAYERSTATS
class PlayerStatsView(APIView):
    def get(self, request, player_uuid):
        player = get_object_or_404(Player, player_uuid=player_uuid)
        season_id = request.query_params.get("season_id")
        player_matches = PlayerMatch.objects.select_related("match", "team", "match__season").filter(player=player)

        if season_id and season_id != "All":
            try:
                player_matches = player_matches.filter(match__season__id=int(season_id))
            except ValueError:
                return Response(
                    {"error": "Invalid season_id"},
                    status=status.HTTP_400_BAD_REQUEST
                )       
            
        total_matches = player_matches.count()
        total_goals = sum(pm.goals_scored for pm in player_matches)
        total_own_goals = sum(pm.own_goals_scored for pm in player_matches)
        matches_scored = player_matches.filter(goals_scored__gt=0).count()

        wins = losses = draws = 0

        for pm in player_matches:
            match = pm.match
            if pm.team == match.team1:
                team_score = match.team1_score
                opponent_score = match.team2_score
            else:
                team_score = match.team2_score
                opponent_score = match.team1_score

            if team_score > opponent_score:
                wins += 1
            elif team_score < opponent_score:
                losses += 1
            else:
                draws += 1

        data = {
            "selected_season": ("All" if not season_id or season_id == "All" else int(season_id)),
            "stats": {
                "matches_scored": matches_scored,
                "matches_played": total_matches,
                "goals_scored": total_goals,
                "own_goals_scored": total_own_goals,
                "wins": wins,
                "losses": losses,
                "draws": draws,
            },
        }

        return Response(data, status=status.HTTP_200_OK)
    
class PlayerStatsListView(ListAPIView):
    serializer_class = PlayerStatsSerializer

    def get_queryset(self):
        return (
            Player.objects.annotate(
                matches_played=Count("playermatch", distinct=True),
                goals_scored=Sum("playermatch__goals_scored"),
                own_goals_scored=Sum("playermatch__own_goals_scored"),
            ).order_by("player_name")
        )
#endregion

