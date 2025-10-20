from django.db import models
import uuid


class Season(models.Model):
    season_year = models.IntegerField(unique=True)

    def __str__(self):
        return str(self.season_year)


class Team(models.Model):
    team_name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.team_name


class Player(models.Model):
    player_uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    player_name = models.CharField(max_length=255)

    def __str__(self):
        return self.player_name


class Match(models.Model):
    match_uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    season = models.ForeignKey(Season, on_delete=models.CASCADE)
    team1 = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='team1_matches')
    team2 = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='team2_matches')
    match_date = models.DateTimeField(auto_now_add=True)
    team1_score = models.IntegerField(default=0)
    team2_score = models.IntegerField(default=0)

    class Meta:
        unique_together = ('season', 'match_date', 'team1', 'team2')

    def __str__(self):
        return f"{self.team1} vs {self.team2} ({self.season})"


class PlayerMatch(models.Model):
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    match = models.ForeignKey(Match, on_delete=models.CASCADE)
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    goals_scored = models.IntegerField(default=0)
    own_goals_scored = models.IntegerField(default=0)

    class Meta:
        unique_together = ('player', 'match')

    def __str__(self):
        return f"{self.player} - {self.match}"
