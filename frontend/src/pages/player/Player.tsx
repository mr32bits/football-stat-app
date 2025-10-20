import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

import { useSeason } from "@/components/season-context";
import StackedBarChart from "@/components/bar";
import CountUp from "react-countup";
import { DecimalCountUp, decimalSeparator, thousandsSeparator } from "@/util";
import { MenuBar, PlayerNavBar } from "@/components/navigation-bars";
import { GoalsChart } from "./charts";
import { Separator } from "@/components/ui/separator";
import { CircleX } from "lucide-react";

type PlayerParams = {
  uuid: string;
  name: string;
  attended_games: number;
  games_scored: number;
  goals: number;
  own_goals: number;
  wins: number;
  draws: number;
  losses: number;
};

type SeasonParams = {
  year: number;
  id: number;
};

type GoalStats = {
  [goals: string]: number;
};
type SeasonPlayerStatsParams = {
  id: number;
  attended_games: number;
  goals: number;
  own_goals: number;
  goals_per_match: any;
  wins: number;
  losses: number;
  draws: number;
  goal_stats: GoalStats[];
};
type SeasonStatsParams = {
  seasons: SeasonParams[] | null;
  stats: SeasonPlayerStatsParams[] | null;
};

function Player() {
  const { uuid } = useParams<keyof PlayerParams>();
  const [player, setPlayer] = useState<PlayerParams>({
    uuid: uuid ? uuid : "",
    name: "",
    attended_games: 0,
    games_scored: 0,
    goals: 0,
    own_goals: 0,
    wins: 0,
    draws: 0,
    losses: 0,
  });
  const { season, setSeason } = useSeason();
  const handleSeasonChange = (newSeason: { year: number; id: number }) => {
    setSeason(newSeason);
  };

  const [stats, setStats] = useState<SeasonStatsParams | null>(null);
  const [currentStats, setCurrentStats] =
    useState<SeasonPlayerStatsParams | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const formattedData =
    stats?.seasons?.map((season, index) => ({
      id: season.id,
      wins: stats?.stats?.[index]?.wins || 0,
      draws: stats?.stats?.[index]?.draws || 0,
      losses: stats?.stats?.[index]?.losses || 0,
    })) || [];
  const fetchData = async () => {
    try {
      setLoading(true);
      const [playerResponse, seasonStatsResponse] = await Promise.all([
        fetch(`${API_URL}/player/` + uuid),
        fetch(`${API_URL}/season-stats/` + uuid),
      ]);
      if (!playerResponse.ok || !seasonStatsResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const playerData = await playerResponse.json();
      const seasonStatsData: SeasonStatsParams =
        await seasonStatsResponse.json();
      console.log("PlayerData:", playerData);
      console.log("SeasonStatsData:", seasonStatsData);

      setTimeout(() => {
        setPlayer(playerData);
        setStats(seasonStatsData);
        setLoading(false);
      }, 0);
    } catch (error) {
      console.error("API Fetch Error:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [uuid]);

  useEffect(() => {
    if (stats && season) {
      const currStats = stats.stats?.find((s) => s.id === season.id) || null;
      currStats ? "" : console.error("ERROR: Season not found!");

      setCurrentStats(currStats);
    }
  }, [stats, season]);

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center h-[18em] w-[18em]  md:h-[30em] md:w-[30em] lg:h-[60em] lg:w-[60em]">
          <Skeleton className="rounded-md w-full h-full" />
        </div>
      ) : (
        <>
          <MenuBar />

          <PlayerNavBar
            _name={player?.name}
            uuid={uuid ? uuid : "--"}
            fetchFn={fetchData}
          />

          <Card>
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
              <div className="flex flex-1 flex-col sm:flex-row sm:items-center px-6 py-5 sm:py-6 justify-center">
                <div className="flex flex-col items-center sm:flex-row sm:items-center w-full">
                  <div className="flex-shrink-0 ">
                    <Avatar className="w-32 h-32 text-lg sm:w-16 sm:h-16">
                      <AvatarFallback className="text-4xl sm:text-xl">
                        {player?.name ? (
                          player.name.charAt(0)
                        ) : (
                          <CircleX className="w-24 h-24 sm:w-10 sm:h-10 stroke-red-500" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex flex-col items-center text-center sm:items-start sm:text-left sm:ml-4 mt-4 sm:mt-0">
                    <CardTitle>{player?.name ? player.name : uuid}</CardTitle>
                    <CardDescription>
                      {player?.name
                        ? i18next.t("Player")
                        : i18next.t("Error.PlayerNotFound")}
                    </CardDescription>
                  </div>
                </div>
              </div>

              <div className="flex">
                <div className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
                  <span className="text-xs text-muted-foreground">
                    {i18next.t("Attended Games")}
                  </span>
                  <div className="w-[80px] sm:w-[120px] text-lg font-bold leading-none sm:text-3xl tabular-nums">
                    <CountUp
                      start={0}
                      end={player?.attended_games}
                      duration={1.5}
                      delay={0.2}
                      separator={thousandsSeparator}
                      decimal={decimalSeparator}
                      useEasing
                    />
                  </div>
                </div>
                <div className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
                  <span className="text-xs text-muted-foreground">
                    {i18next.t("Goals")}
                  </span>
                  <div className="w-[80px] sm:w-[120px] text-lg font-bold leading-none sm:text-3xl tabular-nums">
                    <CountUp
                      start={0}
                      end={player?.goals}
                      duration={1.5}
                      delay={0.2}
                      separator={thousandsSeparator}
                      decimal={decimalSeparator}
                      useEasing
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Card className="bg-muted dark:bg-zinc-900 mt-6">
                <div className="grid lg:grid-cols-6 grid-cols-3 lg:divide-x items-end m-2">
                  <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-left data-[active=true]:bg-muted/50 sm:px-8 sm:py-6 border-r border-b lg:border-r-0 lg:border-b-0">
                    <span className="text-xs text-muted-foreground">
                      {i18next.t("BROKEN Translation")} - Tor ∅
                    </span>
                    <div className="w-[80px] sm:w-[120px] text-lg font-bold leading-none sm:text-3xl tabular-nums">
                      <CountUp
                        end={player.goals / player.attended_games}
                        duration={1.5}
                        decimal={decimalSeparator}
                        decimals={2}
                        delay={0.2}
                        useEasing
                        plugin={
                          new DecimalCountUp({
                            decimalSeparator: decimalSeparator,
                          })
                        }
                        preserveValue
                      />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-left data-[active=true]:bg-muted/50 sm:px-8 sm:py-6 border-r border-b lg:border-r-0 lg:border-b-0 ">
                    <span className="text-xs text-muted-foreground">
                      {i18next.t("BROKEN Translation")} - Netz %
                    </span>
                    <div className="w-[80px] sm:w-[120px] text-lg font-bold leading-none sm:text-3xl tabular-nums">
                      <CountUp
                        end={
                          (player.games_scored * 100) / player.attended_games
                        }
                        duration={1.5}
                        decimal={decimalSeparator}
                        decimals={2}
                        delay={0.2}
                        useEasing
                        plugin={
                          new DecimalCountUp({
                            decimalSeparator: decimalSeparator,
                            suffix: "%",
                          })
                        }
                        preserveValue
                      />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-left data-[active=true]:bg-muted/50 sm:px-8 sm:py-6 border-b lg:border-b-0">
                    <span className="text-xs text-muted-foreground">
                      {i18next.t("BROKEN Translation")} - Sieg %
                    </span>
                    <div className="w-[80px] sm:w-[120px] text-lg font-bold leading-none sm:text-3xl tabular-nums">
                      <CountUp
                        end={(player.wins * 100) / player.attended_games}
                        duration={1.5}
                        decimal={decimalSeparator}
                        decimals={2}
                        delay={0.2}
                        useEasing
                        plugin={
                          new DecimalCountUp({
                            decimalSeparator: decimalSeparator,
                            suffix: "%",
                          })
                        }
                        preserveValue
                      />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-left data-[active=true]:bg-muted/50 sm:px-8 sm:py-6 border-r lg:border-r-0">
                    <span className="text-xs text-muted-foreground">
                      {i18next.t("Wins")}
                    </span>
                    <div className="w-[80px] sm:w-[120px] text-lg font-bold leading-none sm:text-3xl tabular-nums">
                      <CountUp
                        end={player.wins}
                        duration={1.5}
                        delay={0.2}
                        useEasing
                        preserveValue
                      />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-left data-[active=true]:bg-muted/50 sm:px-8 sm:py-6 border-r lg:border-r-0">
                    <span className="text-xs text-muted-foreground">
                      {i18next.t("Draws")}
                    </span>
                    <div className="w-[80px] sm:w-[120px] text-lg font-bold leading-none sm:text-3xl tabular-nums">
                      <CountUp
                        end={player.draws}
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
                        end={player.losses}
                        duration={1.5}
                        delay={0.2}
                        separator={thousandsSeparator}
                        useEasing
                        preserveValue
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </CardContent>
            <Separator />
            <CardContent className="pt-2">
              <Select
                value={season?.id.toString() || ""}
                onValueChange={(value) => {
                  const selectedSeason =
                    (stats?.seasons &&
                      stats?.seasons.find((s) => s.id === parseInt(value))) ||
                    null;
                  if (selectedSeason) {
                    handleSeasonChange({
                      year: selectedSeason.year,
                      id: selectedSeason.id,
                    } as SeasonParams);
                  }
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={i18next.t("Season")} />
                </SelectTrigger>
                <SelectContent className="max-h-[160px]">
                  {stats?.seasons && stats?.seasons?.length > 0 ? (
                    stats.seasons.map((season) => (
                      <SelectItem key={season.id} value={season.id.toString()}>
                        {season.year}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="None" disabled>
                      {i18next.t("Error.NoSeason")}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <Card className="py-3 px-2 my-1">
                <div className="grid grid-cols-4 divide-x items-end">
                  <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-left data-[active=true]:bg-muted/50 sm:px-8 sm:py-6">
                    <span className="text-xs text-muted-foreground">
                      {i18next.t("Attended Games")}
                    </span>
                    <div className="w-[80px] sm:w-[120px] text-lg font-bold leading-none sm:text-3xl tabular-nums">
                      <CountUp
                        end={currentStats ? currentStats.attended_games : 0}
                        duration={1.5}
                        delay={0.2}
                        separator={thousandsSeparator}
                        useEasing
                        preserveValue
                      />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-left data-[active=true]:bg-muted/50 sm:px-8 sm:py-6">
                    <span className="text-xs text-muted-foreground">
                      {i18next.t("Wins")}
                    </span>
                    <div className="w-[80px] sm:w-[120px] text-lg font-bold leading-none sm:text-3xl tabular-nums">
                      <CountUp
                        end={currentStats ? currentStats.wins : 0}
                        duration={1.5}
                        delay={0.2}
                        separator={thousandsSeparator}
                        useEasing
                        preserveValue
                      />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-left data-[active=true]:bg-muted/50 sm:px-8 sm:py-6">
                    <span className="text-xs text-muted-foreground">
                      {i18next.t("Draws")}
                    </span>
                    <div className="w-[80px] sm:w-[120px] text-lg font-bold leading-none sm:text-3xl tabular-nums">
                      <CountUp
                        end={currentStats ? currentStats.draws : 0}
                        duration={1.5}
                        delay={0.2}
                        separator={thousandsSeparator}
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
                        end={currentStats ? currentStats.losses : 0}
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
                <StackedBarChart seasonData={formattedData} />
                <GoalsChart
                  data={currentStats ? currentStats?.goals_per_match : { 1: 0 }}
                />
              </Card>
            </CardContent>
            <CardFooter className="border-t pt-2">footer</CardFooter>
          </Card>
        </>
      )}
    </>
  );
}
export default Player;
