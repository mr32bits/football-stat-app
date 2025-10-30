"use client";

import { Card } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

export function GoalsChart({ data }: { data: Record<number, number> }) {
  const { t } = useTranslation();

  const [chartData, setChartData] = useState<
    { match: number; goals: number }[]
  >([{ match: 0, goals: 0 }]);
  useEffect(() => {
    const keys = Object.keys(data).map(Number);
    const minLength = 5;
    const maxKey = Math.max(Math.max(...keys), minLength);
    const _data = Array.from({ length: maxKey }, (_, i) => ({
      match: i + 1,
      goals: data[i + 1] || 0,
    }));
    setChartData(_data);
  }, [data]);

  const chartConfig = {
    goals: { color: "hsl(var(--chart-1))", label: t("Goals") },
  } satisfies ChartConfig;

  return (
    <Card className="my-4 py-4 h-fit mx-auto">
      <ChartContainer
        config={chartConfig}
        className="lg:h-96 md:h-64 sm:h-56 w-full"
      >
        <BarChart
          accessibilityLayer
          data={chartData}
          margin={{
            top: 30,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="match"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />

          <Bar
            animationDuration={750}
            animationEasing="ease-out"
            dataKey="goals"
            fill="var(--color-goals)"
            radius={8}
            minPointSize={10}
          >
            <LabelList
              position="top"
              offset={12}
              className="fill-foreground"
              fontSize={12}
            />
          </Bar>
          <ChartTooltip
            content={
              <ChartTooltipContent
                hideLabel
                formatter={(value, name, item) => (
                  <>
                    <div
                      className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
                      style={
                        {
                          "--color-bg": `var(--color-${name})`,
                        } as React.CSSProperties
                      }
                    />
                    {value}x
                    <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                      {item.payload.match}
                      <span className="font-normal text-muted-foreground">
                        {t("Goal", { count: item.payload.match })}
                      </span>
                    </div>
                  </>
                )}
              />
            }
            cursor={false}
            defaultIndex={1}
          />
          <ChartLegend content={<ChartLegendContent />} />
        </BarChart>
      </ChartContainer>
    </Card>
  );
}
