import { useEffect, useState } from "react";
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
import { AnimatedStat, DecimalCountUp } from "@/util";
import { MenuBar, PlayerNavBar } from "@/components/navigation-bars";
import { GoalsChart } from "./charts";
import { Separator } from "@/components/ui/separator";
import { CircleX } from "lucide-react";
import { useTranslation } from "react-i18next";

type PlayerSeasonParams = {
  selected_season: number;
  stats: {
    matches_played: number;
    matches_scored: number;
    goals_scored: number;
    own_goals_scored: number;
    wins: number;
    losses: number;
    draws: number;
  };
};

export function Player() {
  const { t } = useTranslation();

  const { uuid } = useParams<string>();
  const [player, setPlayer] = useState<{
    id: number;
    player_name: string;
    player_uuid: string;
  }>({ id: -1, player_name: "", player_uuid: uuid ? uuid : "" });
  const { season, setSeason } = useSeason();
  const [seasons, setSeasons] = useState<
    | {
        id: number;
        season_year: number;
      }[]
    | []
  >([]);
  const handleSeasonChange = (
    newSeason:
      | {
          season_year: number;
          id: number;
        }
      | "All"
  ) => {
    setSeason(newSeason);
  };
  const [stats, setStats] = useState<PlayerSeasonParams>({
    selected_season: -1,
    stats: {
      matches_played: 0,
      matches_scored: 0,
      goals_scored: 0,
      own_goals_scored: 0,
      wins: 0,
      losses: 0,
      draws: 0,
    },
  });
  const [loading, setLoading] = useState<boolean>(true);
  const formattedData = stats?.selected_season
    ? {
        id: stats.selected_season,
        wins: stats.stats.wins || 0,
        draws: stats.stats.draws || 0,
        losses: stats.stats.losses || 0,
      }
    : { id: 0, wins: 0, draws: 0, losses: 0 };
  const fetchData = async () => {
    try {
      setLoading(true);
      const [playerResponse, seasonsResponse] = await Promise.all([
        fetch(`${API_URL}/players/` + uuid),
        fetch(`${API_URL}/seasons/`),
      ]);
      if (!playerResponse.ok || !seasonsResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const playerData = await playerResponse.json();
      const seasonsData = await seasonsResponse.json();
      console.log("PlayerData:", playerData);
      console.log("SeasonData:", seasonsData);

      setTimeout(() => {
        setPlayer(playerData);
        setSeasons(seasonsData);
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

  const fetchSeasonStatData = async () => {
    if (season === null) return;
    try {
      let query = "";
      if (season !== "All") {
        query = `?season_id=${season.id}`;
      }

      const playerStatsResponse = await fetch(
        `${API_URL}/players/${uuid}/stats/${query}`
      );

      if (!playerStatsResponse.ok) {
        throw new Error("Failed to fetch data");
      }
      const playerStatsData = await playerStatsResponse.json();
      console.log("PlayerStatsData: ", playerStatsData);
      setStats(playerStatsData);
    } catch (error) {
      console.error("API Fetch Error:", error);
    }
  };
  useEffect(() => {
    fetchSeasonStatData();
  }, [season]);

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
            _name={player?.player_name}
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
                        {player?.player_name ? (
                          player.player_name.charAt(0)
                        ) : (
                          <CircleX className="w-24 h-24 sm:w-10 sm:h-10 stroke-red-500" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex flex-col items-center text-center sm:items-start sm:text-left sm:ml-4 mt-4 sm:mt-0">
                    <CardTitle>
                      {player?.player_name ? player.player_name : uuid}
                    </CardTitle>
                    <CardDescription>
                      {player?.player_name
                        ? t("Player")
                        : t("Error.PlayerNotFound")}
                    </CardDescription>
                  </div>
                </div>
              </div>

              <div className="flex">
                <div className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
                  <span className="text-xs text-muted-foreground">
                    {t("Attended Games")}
                  </span>
                  <div className="w-[80px] sm:w-[120px] text-lg font-bold leading-none sm:text-3xl tabular-nums">
                    <AnimatedStat value={stats?.stats?.matches_played ?? 0} />
                  </div>
                </div>
                <div className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
                  <span className="text-xs text-muted-foreground">
                    {t("Goals")}
                  </span>
                  <div className="w-[80px] sm:w-[120px] text-lg font-bold leading-none sm:text-3xl tabular-nums">
                    <AnimatedStat value={stats?.stats?.goals_scored ?? 0} />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Card className="bg-muted dark:bg-zinc-900 mt-6">
                <div className="grid lg:grid-cols-6 grid-cols-3 lg:divide-x items-end m-2">
                  <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-left data-[active=true]:bg-muted/50 sm:px-8 sm:py-6 border-r border-b lg:border-r-0 lg:border-b-0">
                    <span className="text-xs text-muted-foreground">
                      {t("BROKEN Translation")} - Tor ∅
                    </span>
                    <div className="w-[80px] sm:w-[120px] text-lg font-bold leading-none sm:text-3xl tabular-nums">
                      <AnimatedStat
                        value={
                          stats?.stats?.goals_scored /
                          stats?.stats?.matches_played
                        }
                        decimalPlaces={2}
                        plugin={new DecimalCountUp()}
                      />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-left data-[active=true]:bg-muted/50 sm:px-8 sm:py-6 border-r border-b lg:border-r-0 lg:border-b-0 ">
                    <span className="text-xs text-muted-foreground">
                      {t("BROKEN Translation")} - Netz %
                    </span>
                    <div className="w-[80px] sm:w-[120px] text-lg font-bold leading-none sm:text-3xl tabular-nums">
                      <AnimatedStat
                        value={
                          (stats?.stats?.matches_scored * 100) /
                            stats?.stats?.matches_played || 0
                        }
                        decimalPlaces={2}
                        plugin={
                          new DecimalCountUp({
                            suffix: "%",
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-left data-[active=true]:bg-muted/50 sm:px-8 sm:py-6 border-b lg:border-b-0">
                    <span className="text-xs text-muted-foreground">
                      {t("BROKEN Translation")} - Sieg %
                    </span>
                    <div className="w-[80px] sm:w-[120px] text-lg font-bold leading-none sm:text-3xl tabular-nums">
                      <AnimatedStat
                        value={
                          (stats?.stats?.wins * 100) /
                            stats?.stats?.matches_played || 0
                        }
                        decimalPlaces={2}
                        plugin={
                          new DecimalCountUp({
                            suffix: "%",
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-left data-[active=true]:bg-muted/50 sm:px-8 sm:py-6 border-r lg:border-r-0">
                    <span className="text-xs text-muted-foreground">
                      {t("Wins")}
                    </span>
                    <div className="w-[80px] sm:w-[120px] text-lg font-bold leading-none sm:text-3xl tabular-nums">
                      <AnimatedStat value={stats?.stats?.wins ?? 0} />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-left data-[active=true]:bg-muted/50 sm:px-8 sm:py-6 border-r lg:border-r-0">
                    <span className="text-xs text-muted-foreground">
                      {t("Draws")}
                    </span>
                    <div className="w-[80px] sm:w-[120px] text-lg font-bold leading-none sm:text-3xl tabular-nums">
                      <AnimatedStat value={stats?.stats?.draws ?? 0} />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-left data-[active=true]:bg-muted/50 sm:px-8 sm:py-6">
                    <span className="text-xs text-muted-foreground">
                      {t("Losses")}
                    </span>
                    <div className="w-[80px] sm:w-[120px] text-lg font-bold leading-none sm:text-3xl tabular-nums">
                      <AnimatedStat value={stats?.stats?.losses ?? 0} />
                    </div>
                  </div>
                </div>
              </Card>
            </CardContent>
            <Separator />
            <CardContent className="pt-2">
              <Select
                value={season === "All" ? "-1" : season?.id?.toString() || ""}
                onValueChange={(value) => {
                  if (value == "-1") {
                    handleSeasonChange("All");
                  } else {
                    const selectedSeason =
                      (seasons &&
                        seasons.find((s) => s.id === parseInt(value))) ||
                      null;
                    if (selectedSeason) {
                      handleSeasonChange({
                        season_year: selectedSeason.season_year,
                        id: selectedSeason.id,
                      });
                    }
                  }
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t("Season")} />
                </SelectTrigger>
                <SelectContent className="max-h-[160px]">
                  {seasons && seasons.length > 0 ? (
                    seasons.map((season) => (
                      <SelectItem key={season.id} value={season.id.toString()}>
                        {season.season_year}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="None" disabled>
                      {t("Error.NoSeason")}
                    </SelectItem>
                  )}
                  {seasons ? (
                    <SelectItem value="-1">{"Alle"}</SelectItem>
                  ) : (
                    <></>
                  )}
                </SelectContent>
              </Select>
              <Card className="py-3 px-2 my-1">
                <div className="grid grid-cols-4 divide-x items-end">
                  <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-left data-[active=true]:bg-muted/50 sm:px-8 sm:py-6">
                    <span className="text-xs text-muted-foreground">
                      {t("Attended Games")}
                    </span>
                    <div className="w-[80px] sm:w-[120px] text-lg font-bold leading-none sm:text-3xl tabular-nums">
                      <AnimatedStat value={stats.stats.matches_played ?? 0} />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-left data-[active=true]:bg-muted/50 sm:px-8 sm:py-6">
                    <span className="text-xs text-muted-foreground">
                      {t("Wins")}
                    </span>
                    <div className="w-[80px] sm:w-[120px] text-lg font-bold leading-none sm:text-3xl tabular-nums">
                      <AnimatedStat value={stats.stats.wins ?? 0} />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-left data-[active=true]:bg-muted/50 sm:px-8 sm:py-6">
                    <span className="text-xs text-muted-foreground">
                      {t("Draws")}
                    </span>
                    <div className="w-[80px] sm:w-[120px] text-lg font-bold leading-none sm:text-3xl tabular-nums">
                      <AnimatedStat value={stats.stats.draws ?? 0} />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-left data-[active=true]:bg-muted/50 sm:px-8 sm:py-6">
                    <span className="text-xs text-muted-foreground">
                      {t("Losses")}
                    </span>
                    <div className="w-[80px] sm:w-[120px] text-lg font-bold leading-none sm:text-3xl tabular-nums">
                      <AnimatedStat value={stats.stats.losses ?? 0} />
                    </div>
                  </div>
                </div>

                <div className="grid justify-items-start border-t p-1">
                  <span className="text-sm font-bold">
                    {t("Match Results")}
                  </span>
                </div>
                <StackedBarChart seasonData={formattedData} />
                <GoalsChart data={{ 1: 0 }} />
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
