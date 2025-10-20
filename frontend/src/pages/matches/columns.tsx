"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import i18next from "@/translation/translation";
import { Checkbox } from "@/components/ui/checkbox";
import { dateFormat } from "@/util";

export type SeasonData = {
  season_id: number;
  matches: MatchData[];
};

export type MatchData = {
  match_id: number;
  match_uuid: string;
  match_date: Date;
  team1_score: number;
  team2_score: number;
};

export type MatchWithSeason = MatchData & {
  season_id: number;
  season_year: number;
};

export const columns: ColumnDef<MatchWithSeason>[] = [
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
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
    header: i18next.t("Match Date"),
    sortingFn: "datetime",
    enableSorting: true,
    cell: ({ row }) => (
      <Link
        to={`/match/${row.original.match_uuid}`}
        className="text-muted-foreground hover:underline"
      >
        {dateFormat(row.original.match_date)}
        {
          //row.original.match_date
        }
      </Link>
    ),
  },

  {
    accessorKey: "season_year",
    header: i18next.t("Season"),
    sortDescFirst: true,
    enableSorting: true,
  },
  {
    accessorKey: "team1_score",
    header: "Team 1 " + i18next.t("Goals"),
  },
  {
    accessorKey: "team2_score",
    header: "Team 2 " + i18next.t("Goals"),
  },
];
