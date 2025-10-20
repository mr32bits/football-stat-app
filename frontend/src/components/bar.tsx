import { useSeason } from "@/components/season-context";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import i18next from "i18next";

const testData = [
  { id: 1, wins: 3, draws: 22, losses: 13 },
  { id: 2, wins: 14, draws: 23, losses: 3 },
];
/*const chartConfig = {};

export default function StackedBarChart({
  data,
}: {
  data: {
    id: number;
    name: string;
    wins: number;
    draws: number;
    losses: number;
  }[];
}) {
  const { season } = useSeason();
  const selectedSeasonData = testData.find((s) => s.id === season?.id) || null;
  return (
    <Card className="p-4">
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="max-h-[50px] w-full rounded-lg"
        >
          <BarChart
            data={selectedSeasonData ? [selectedSeasonData] : []}
            layout="vertical"
          >
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" hide />
            <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
            <Bar
              dataKey="wins"
              stackId="1"
              fill="#00c951"
              name="Wins"
              radius={[10, 10, 10, 10]}
            />
            <Bar
              dataKey="draws"
              stackId="1"
              fill="#6a7282"
              name="Draws"
              radius={[10, 10, 10, 10]}
            />
            <Bar
              className="fill-red-500"
              dataKey="losses"
              stackId="1"
              fill="#EF4444"
              name="Losses"
              radius={[10, 10, 10, 10]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}*/

function StackedBarChartBar({
  seasonData,
}: {
  seasonData: {
    id: number;
    wins: number;
    draws: number;
    losses: number;
  }[];
}) {
  const { season } = useSeason();

  const data = seasonData.find((s) => s.id === season?.id) || {
    wins: 0,
    draws: 0,
    losses: 0,
  };
  const total = data.wins + data.draws + data.losses;
  const [animatedWins, setAnimatedWins] = useState(0);
  const [animatedDraws, setAnimatedDraws] = useState(0);
  const [animatedLosses, setAnimatedLosses] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setAnimatedWins(total ? (data.wins / total) * 100 : 0);
      setAnimatedDraws(total ? (data.draws / total) * 100 : 0);
      setAnimatedLosses(total ? (data.losses / total) * 100 : 0);
    }, 100);
  }, [data.wins, data.draws, data.losses, total]);

  return (
    <TooltipProvider>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-primary/20 flex">
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className="h-full w-full transition-all duration-1000 ease-in-out"
              style={{ width: `${animatedWins}%` }}
            >
              <div className="h-full bg-[linear-gradient(to_right,theme(colors.green.500),theme(colors.emerald.500),theme(colors.green.500))] bg-[length:200%_auto] animate-gradient" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {i18next.t("Wins")}: {data.wins} ({animatedWins.toFixed(2)}%)
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className="h-full w-full transition-all duration-1000 ease-in-out"
              style={{ width: `${animatedDraws}%` }}
            >
              <div className="h-full bg-gradient-to-r from-gray-300 via-zinc-400 to-gray-300 dark:from-gray-500 dark:via-zinc-700 dark:to-gray-500 animate-gradient bg-[length:200%_auto] " />
              {/*<div className="h-full dark:bg-[linear-gradient(to_right,theme(colors.gray.500),theme(colors.zinc.700),theme(colors.gray.500))] bg-[length:200%_auto] animate-gradient" />*/}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {i18next.t("Draws")}: {data.draws} ({animatedDraws.toFixed(2)}%)
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className="h-full w-full transition-all duration-1000 ease-in-out"
              style={{ width: `${animatedLosses}%` }}
            >
              <div className="h-full bg-[linear-gradient(to_right,theme(colors.red.500),theme(colors.orange.500),theme(colors.red.500))] bg-[length:200%_auto] animate-gradient" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {i18next.t("Losses")}: {data.losses} ({animatedLosses.toFixed(2)}%)
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

export default StackedBarChartBar;
