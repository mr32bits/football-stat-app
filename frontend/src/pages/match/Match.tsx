import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { API_URL } from "../../constants/constants";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { Skeleton } from "@/components/ui/skeleton";

import { AnimatedStat, dateFormat } from "@/util";
import {
  MatchNavBar,
  MenuBar,
  SimplifiedPlayerParams,
} from "@/components/navigation-bars";
import { CalendarFold, CircleX } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MatchData } from "../matches/columns";
import { useTranslation } from "react-i18next";

export type PlayerParams = {
  id: number;
  player: { id: number; player_uuid: string; player_name: string };
  team_id: number;
  goals_scored: number;
  own_goals_scored: number;
};

export type SeasonParams = {
  id: number;
  season_year: number;
};

function Match() {
  const { t } = useTranslation();

  const { match_uuid } = useParams<keyof MatchData>();
  const [match, setMatch] = useState<{
    match: MatchData;
    players: PlayerParams[];
  }>();
  const [, setSeasons] = useState<SeasonParams[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const team1Players: SimplifiedPlayerParams[] = match?.players
    ? match.players
        .filter((player) => player.team_id === match.match.team1.id)
        .map((p) => ({
          player_uuid: p.player.player_uuid ?? "",
          player_id: p.player.id,
          goals_scored: p.goals_scored ?? 0,
          own_goals_scored: p.own_goals_scored ?? 0,
        }))
    : [];
  function getTeam1Player(index: number) {
    const player = match?.players.find(
      (p) => p.player.player_uuid === team1Players[index]?.player_uuid
    );
    return player;
  }
  function getTeam2Player(index: number) {
    const player = match?.players.find(
      (p) => p.player.player_uuid === team2Players[index]?.player_uuid
    );
    return player;
  }

  const team2Players: SimplifiedPlayerParams[] = match?.players
    ? match.players
        .filter((player) => player.team_id === match.match.team2.id)
        .map((p) => ({
          player_uuid: p.player.player_uuid ?? "",
          player_id: p.player.id,
          goals_scored: p.goals_scored ?? 0,
          own_goals_scored: p.own_goals_scored ?? 0,
        }))
    : [];

  const maxRows = Math.max(team1Players.length, team2Players.length);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [matchResponse, seasonResponse] = await Promise.all([
        fetch(`${API_URL}/matches/` + match_uuid),
        fetch(`${API_URL}/seasons/`),
      ]);
      if (!matchResponse.ok || !seasonResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const matchData = await matchResponse.json();
      const seasons = await seasonResponse.json();
      console.log("MatchData:", matchData);
      console.log("SeasonData:", seasons);

      setTimeout(() => {
        setMatch(matchData);
        setSeasons(seasons);
        setLoading(false);
      }, 200);
    } catch (error) {
      console.error("API Fetch Error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [match_uuid]);
  console.log(match);

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center h-[18em] w-[18em]  md:h-[30em] md:w-[30em] lg:h-[60em] lg:w-[60em]">
          <Skeleton className="rounded-md w-full h-full" />
        </div>
      ) : (
        <>
          <MenuBar />

          <MatchNavBar
            match_id={match?.match?.id ? match.match.id : -1}
            match_uuid={match_uuid ? match_uuid : ""}
            match_date={
              match?.match?.match_date && new Date(match.match.match_date)
                ? new Date(match.match.match_date)
                : undefined
            }
            team_1Players={team1Players}
            team_2Players={team2Players}
            team1={match?.match?.team1}
            team2={match?.match?.team2}
            match_season_id={
              match?.match?.season?.id ? match.match.season.id : -1
            }
            fetchFn={fetchData}
          />

          <Card>
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
              <div className="flex flex-1 flex-col sm:flex-row sm:items-center px-6 py-5 sm:py-6 justify-center">
                <div className="flex flex-col items-center sm:flex-row sm:items-center w-full">
                  <div className="flex-shrink-0 ">
                    <Avatar className="w-32 h-32 text-lg sm:w-16 sm:h-16">
                      <AvatarFallback>
                        {match ? (
                          <CalendarFold className="w-16 h-16 sm:w-8 sm:h-8" />
                        ) : (
                          <CircleX className="w-24 h-24 sm:w-10 sm:h-10 stroke-red-500" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex flex-col items-center text-center sm:items-start sm:text-left sm:ml-4 mt-4 sm:mt-0">
                    <CardTitle>
                      {match?.match?.match_date
                        ? dateFormat(match?.match.match_date)
                        : match_uuid}
                    </CardTitle>
                    <CardDescription>
                      {match?.match?.match_date ? (
                        <>
                          {t("Saison")}{" "}
                          {match?.match?.season.season_year
                            ? match?.match?.season.season_year
                            : "Season for id '" +
                              match.match.season.id +
                              "' not found!"}
                        </>
                      ) : (
                        t("Error.MatchNotFound")
                      )}
                    </CardDescription>
                  </div>
                </div>
              </div>

              <div className="flex divide-x border-t sm:border-t-0 justify-items-stretch">
                <div className="flex basis-1/2 flex-col justify-center gap-1 px-6 py-4 text-left data-[active=true]:bg-muted/50 sm:border-l sm:px-8 sm:py-6">
                  <span className="text-xs text-muted-foreground">
                    {t("Match Result")}
                  </span>
                  <div className="w-[80px] sm:w-[120px] text-lg font-bold leading-none sm:text-3xl tabular-nums">
                    <AnimatedStat value={match?.match?.team1_score ?? 0} />
                    <span className="text-muted-foreground text-sm sm:text-3xl">
                      {" : "}
                    </span>
                    <AnimatedStat value={match?.match?.team2_score ?? 0} />
                  </div>
                </div>

                <div className="flex basis-1/2 flex-col justify-center gap-1 px-6 py-4 text-left data-[active=true]:bg-muted/50 sm:border-l sm:px-8 sm:py-6">
                  <span className="text-xs text-muted-foreground">
                    {t("NumberOfPlayers")}
                  </span>
                  <div className="text-lg font-bold leading-none sm:text-3xl tabular-nums">
                    {team1Players?.length ? (
                      <AnimatedStat value={team1Players?.length ?? 0} />
                    ) : (
                      "-"
                    )}
                    <span className="text-muted-foreground text-sm sm:text-3xl">
                      {" vs. "}
                    </span>
                    {team2Players?.length ? (
                      <AnimatedStat value={team2Players?.length ?? 0} />
                    ) : (
                      "-"
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-2">
              <div className="border rounded-xl mt-2 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/3 text-right">Team 1</TableHead>
                      <TableHead className="w-1/6 text-center">:</TableHead>
                      <TableHead className="w-1/3 text-left">Team 2</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {maxRows > 0 ? (
                      Array.from({ length: maxRows }).map((_, index) => (
                        <TableRow key={index}>
                          {/* Team 1 Column */}
                          <TableCell className="text-right">
                            {team1Players[index].player_id &&
                            getTeam2Player(index) ? (
                              <div className="grid grid-cols-6 items-center gap-2">
                                <Link
                                  to={`/player/${team1Players[index].player_uuid}`}
                                  className="col-span-4 text-muted-foreground hover:underline text-right"
                                >
                                  {getTeam2Player(index)?.player.player_name}
                                </Link>
                                <span className="col-span-1 text-right">
                                  {team1Players[index].own_goals_scored > 0 && (
                                    <>
                                      ({team1Players[index].own_goals_scored})
                                    </>
                                  )}
                                </span>
                                <span className="col-span-1 text-right">
                                  {team1Players[index].goals_scored}
                                </span>
                              </div>
                            ) : (
                              "-"
                            )}
                          </TableCell>

                          {/* Separator Column */}
                          <TableCell className="text-center">:</TableCell>

                          {/* Team 2 Column */}
                          <TableCell className="text-left">
                            {team2Players[index] && getTeam1Player(index) ? (
                              <div className="grid grid-cols-6 items-center gap-2">
                                <span className="col-span-1 text-left">
                                  {team2Players[index].goals_scored}
                                </span>
                                <span className="col-span-1 text-left">
                                  {team2Players[index].own_goals_scored > 0 && (
                                    <>
                                      ({team2Players[index].own_goals_scored})
                                    </>
                                  )}
                                </span>
                                <Link
                                  to={`/player/${team2Players[index].player_uuid}`}
                                  className="col-span-4 text-muted-foreground hover:underline text-left"
                                >
                                  {getTeam1Player(index)?.player.player_name}
                                </Link>
                              </div>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center h-24">
                          {t("Warning.NoResults")}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-2">
              <span className="text-xs text-muted-foreground">©MR</span>
            </CardFooter>
          </Card>
        </>
      )}
    </>
  );
}
export default Match;
