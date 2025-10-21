from rest_framework import serializers
from .models import Season, Team, Player, Match, PlayerMatch


class SeasonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Season
        fields = ['id', 'season_year']


class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ['id', 'team_name']


class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ['id', 'player_uuid', 'player_name']


class MatchSerializer(serializers.ModelSerializer):
    season = SeasonSerializer(read_only=True)
    team1 = TeamSerializer(read_only=True)
    team2 = TeamSerializer(read_only=True)

    season_id = serializers.PrimaryKeyRelatedField(
        queryset=Season.objects.all(), source='season', write_only=True
    )
    team1_id = serializers.PrimaryKeyRelatedField(
        queryset=Team.objects.all(), source='team1', write_only=True
    )
    team2_id = serializers.PrimaryKeyRelatedField(
        queryset=Team.objects.all(), source='team2', write_only=True
    )
    
    def validate(self, attrs):
        data = super().validate(attrs)
        team1 = data.get('team1')
        team2 = data.get('team2')

        if team1 == team2:
            raise serializers.ValidationError("Given Teams are the same.")
        return data

    class Meta:
        model = Match
        fields = [
            'id', 'match_uuid', 'season', 'team1', 'team2',
            'season_id', 'team1_id', 'team2_id',
            'match_date', 'team1_score', 'team2_score'
        ]


class PlayerMatchSerializer(serializers.ModelSerializer):
    player = PlayerSerializer(read_only=True)
    match = MatchSerializer(read_only=True)
    team = TeamSerializer(read_only=True)

    player_id = serializers.PrimaryKeyRelatedField(
        queryset=Player.objects.all(), source='player', write_only=True
    )
    match_id = serializers.PrimaryKeyRelatedField(
        queryset=Match.objects.all(), source='match', write_only=True
    )
    team_id = serializers.PrimaryKeyRelatedField(
        queryset=Team.objects.all(), source='team', write_only=True
    )

    class Meta:
        model = PlayerMatch
        fields = [
            'id', 'player', 'match', 'team',
            'player_id', 'match_id', 'team_id',
            'goals_scored', 'own_goals_scored'
        ]