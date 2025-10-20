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
import i18next from "@/translation/translation";

import { Skeleton } from "@/components/ui/skeleton";

import CountUp from "react-countup";
import { dateFormat } from "@/util";
import { MatchNavBar, MenuBar } from "@/components/navigation-bars";
import { CalendarFold, CircleX } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type MatchParams = {
  match_uuid: string;
  match_date: string;
  match_id: number;
  season_id: number;
  team1_score: number;
  team2_score: number;
};
export type PlayerParams = {
  goals_scored: number;
  match_id: number;
  own_goals_scored: number;
  player_id: number;
  player_match_id: number;
  player_uuid: string;
  player_name: string;
  team_id: number;
};
export type SeasonParams = {
  year: number;
  id: number;
}[];

function Match() {
  const { match_uuid } = useParams<keyof MatchParams>();
  const [match, setMatch] = useState<{
    match: MatchParams;
    players: PlayerParams[];
  } | null>(null);
  const [seasons, setSeasons] = useState<SeasonParams | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const team1Players = match
    ? match?.players.filter((player) => player.team_id == 1)
    : [];
  const team2Players = match
    ? match?.players.filter((player) => player.team_id == 2)
    : [];

  const maxRows = Math.max(team1Players.length, team2Players.length);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [matchResponse, seasonResponse] = await Promise.all([
        fetch(`${API_URL}/match/` + match_uuid),
        fetch(`${API_URL}/seasons`),
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
            match_id={match?.match.match_id ? match.match.match_id : -1}
            match_uuid={match_uuid ? match_uuid : ""}
            match_date={
              match?.match && new Date(match.match.match_date)
                ? new Date(match.match.match_date)
                : undefined
            }
            team_1Players={team1Players}
            team_2Players={team2Players}
            match_season_id={match ? match?.match.season_id : -1}
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
                      {match?.match.match_date ? (
                        <>
                          {i18next.t("Saison")}{" "}
                          {seasons
                            ? seasons?.find(
                                (s) => s.id === match.match.season_id
                              )?.year
                            : "Season for id '" +
                              match.match.season_id +
                              "' not found!"}
                        </>
                      ) : (
                        i18next.t("Error.MatchNotFound")
                      )}
                    </CardDescription>
                  </div>
                </div>
              </div>

              <div className="flex divide-x border-t sm:border-t-0 justify-items-stretch">
                <div className="flex basis-1/2 flex-col justify-center gap-1 px-6 py-4 text-left data-[active=true]:bg-muted/50 sm:border-l sm:px-8 sm:py-6">
                  <span className="text-xs text-muted-foreground">
                    {i18next.t("Match Result")}
                  </span>
                  <div className="w-[80px] sm:w-[120px] text-lg font-bold leading-none sm:text-3xl tabular-nums">
                    {match?.match.team1_score ? (
                      <CountUp
                        start={0}
                        end={match?.match.team1_score}
                        duration={1.5}
                        delay={0.2}
                        useEasing
                      />
                    ) : (
                      "0"
                    )}
                    <span className="text-muted-foreground text-sm sm:text-2xl">
                      {" : "}
                    </span>
                    {match?.match.team2_score ? (
                      <CountUp
                        start={0}
                        end={match?.match.team2_score}
                        duration={1.5}
                        delay={0.2}
                        useEasing
                      />
                    ) : (
                      "0"
                    )}
                  </div>
                </div>

                <div className="flex basis-1/2 flex-col justify-center gap-1 px-6 py-4 text-left data-[active=true]:bg-muted/50 sm:border-l sm:px-8 sm:py-6">
                  <span className="text-xs text-muted-foreground">
                    {i18next.t("NumberOfPlayers")}
                  </span>
                  <div className="text-lg font-bold leading-none sm:text-3xl tabular-nums">
                    {team1Players?.length ? (
                      <CountUp
                        start={0}
                        end={team1Players?.length}
                        duration={1.5}
                        delay={0.2}
                        useEasing
                      />
                    ) : (
                      "-"
                    )}
                    <span className="text-muted-foreground text-sm sm:text-2xl">
                      {" vs. "}
                    </span>
                    {team2Players?.length ? (
                      <CountUp
                        start={0}
                        end={team2Players?.length}
                        duration={1.5}
                        delay={0.2}
                        useEasing
                      />
                    ) : (
                      "-"
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-2">
              {/*              <Card className="px-2">
                <div className="grid grid-cols-2 sm:grid-cols-4 sm:divide-x items-end my-2">
                  <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-left data-[active=true]:bg-muted/50 sm:px-8 sm:py-6 border-r border-b sm:border-r-0 sm:border-b-0">
                    <span className="text-xs text-muted-foreground">
                      {i18next.t("Attended Games")}
                    </span>
                    <div className="w-[80px] sm:w-[120px] text-lg font-bold leading-none sm:text-3xl tabular-nums">
                      <CountUp
                        end={0}
                        duration={1.5}
                        delay={0.2}
                        useEasing
                        preserveValue
                      />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-left data-[active=true]:bg-muted/50 sm:px-8 sm:py-6 border-b sm:border-b-0">
                    <span className="text-xs text-muted-foreground">
                      {i18next.t("Wins")}
                    </span>
                    <div className="w-[80px] sm:w-[120px] text-lg font-bold leading-none sm:text-3xl tabular-nums">
                      <CountUp
                        end={0}
                        duration={1.5}
                        delay={0.2}
                        useEasing
                        preserveValue
                      />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-left data-[active=true]:bg-muted/50 sm:px-8 sm:py-6 border-r sm:border-r-0">
                    <span className="text-xs text-muted-foreground">
                      {i18next.t("Draws")}
                    </span>
                    <div className="w-[80px] sm:w-[120px] text-lg font-bold leading-none sm:text-3xl tabular-nums">
                      <CountUp
                        end={0}
                        duration={1.5}
                        delay={0.2}
                        useEasing
                        preserveValue
                      />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-left data-[active=true]:bg-muted/50 sm:px-8 sm:py-6">
                    <span className="text-xs text-muted-foreground">
                      {i18next.t("Losses")}
                    </span>
                    <div className="w-[80px] sm:w-[120px] text-lg font-bold leading-none sm:text-3xl tabular-nums">
                      <CountUp
                        end={0}
                        duration={1.5}
                        delay={0.2}
                        separator={thousandsSeparator}
                        useEasing
                        preserveValue
                      />
                    </div>
                  </div>
                </div>
                <div className="grid justify-items-start border-t p-1">
                  <span className="text-sm font-bold">
                    {i18next.t("Match Results")}
                  </span>
                </div>
              </Card>*/}
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
                            {team1Players[index] ? (
                              <div className="grid grid-cols-6 items-center gap-2">
                                <Link
                                  to={`/player/${team1Players[index].player_uuid}`}
                                  className="col-span-4 text-muted-foreground hover:underline text-right"
                                >
                                  {team1Players[index].player_name}
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
                            {team2Players[index] ? (
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
                                  {team2Players[index].player_name}
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
                          {i18next.t("Warning.NoResults")}
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
