"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { dateFormat } from "@/util";
import { useTranslation } from "react-i18next";

export type SeasonData = {
  season_id: number;
  matches: MatchData[];
};

export type MatchData = {
  id: number;
  match_uuid: string;
  match_date: Date;
  team1_score: number;
  team2_score: number;
  season: {
    id: number;
    season_year: number;
  };
  team1: {
    id: number;
    team_name: string;
  };
  team2: {
    id: number;
    team_name: string;
  };
};

export function useMatchColumns(): ColumnDef<MatchData>[] {
  const { t } = useTranslation();

  return [
    {
      id: "select",
      header: ({ table }) => (
        <>
          <Checkbox
            className="h-4 w-4 p-0 align-top"
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        </>
      ),
      cell: ({ row }) => (
        <Checkbox
          className="h-4 w-4 p-0 align-top"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "match_date",
      header: t("Match Date"),
      sortingFn: "datetime",
      enableSorting: true,
      sortDescFirst: true,
      cell: ({ row }) => (
        <Link
          to={`/match/${row.original.match_uuid}`}
          className="text-muted-foreground hover:underline"
        >
          {dateFormat(row.original.match_date)}
        </Link>
      ),
    },

    {
      accessorKey: "season.season_year",
      header: t("Season"),
      sortDescFirst: true,
      enableSorting: true,
    },
    {
      accessorKey: "team1_score",
      header: "Team 1 " + t("Goals"),
    },
    {
      accessorKey: "team2_score",
      header: "Team 2 " + t("Goals"),
    },
  ];
}
