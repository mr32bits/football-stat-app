import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useTranslation } from "react-i18next";

export function StackedBarChartBar({
  seasonData,
}: {
  seasonData: {
    id: number;
    wins: number;
    draws: number;
    losses: number;
  };
}) {
  const { t } = useTranslation("translation");

  const data = seasonData;
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
            {t("Wins")}: {data.wins} ({animatedWins.toFixed(2)}%)
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
            {t("Draws")}: {data.draws} ({animatedDraws.toFixed(2)}%)
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
            {t("Losses")}: {data.losses} ({animatedLosses.toFixed(2)}%)
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

export default StackedBarChartBar;
