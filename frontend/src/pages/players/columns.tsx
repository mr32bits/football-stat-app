"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { PlayersStats } from "./Players";
import { useTranslation } from "react-i18next";

export function usePlayerColumns(): ColumnDef<PlayersStats>[] {
  const { t } = useTranslation();

  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="h-4 w-4 p-0 align-top"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
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
      accessorKey: "player_name",
      header: t("Name"),
      cell: ({ row }) => (
        <Link
          to={`/player/${row.original.player_uuid}`}
          className="text-muted-foreground hover:underline"
        >
          {row.original.player_name}
        </Link>
      ),
    },
    {
      accessorKey: "goals_scored",
      header: t("Goals"),
      cell: ({ row }) => row.original.goals_scored || 0,
    },
    {
      accessorKey: "own_goals_scored",
      header: t("Own Goals"),
      cell: ({ row }) => row.original.own_goals_scored || 0,
    },
    {
      accessorKey: "matches_played",
      header: t("Attended Games"),
    },
  ];
}
