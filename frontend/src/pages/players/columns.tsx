"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";

export type PlayerData = {
  uuid: string;
  id: number;
  name: string;
  goals: number;
  own_goals: number;
  attended_games: number;
};

import i18next from "@/translation/translation";
import { Checkbox } from "@/components/ui/checkbox";

export const columns: ColumnDef<PlayerData>[] = [
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
    accessorKey: "name",
    header: i18next.t("Name"),
    cell: ({ row }) => (
      <Link
        to={`/player/${row.original.uuid}`}
        className="text-muted-foreground hover:underline"
      >
        {row.original.name}
      </Link>
    ),
  },

  {
    accessorKey: "goals",
    header: i18next.t("Goals"),
  },
  {
    accessorKey: "own_goals",
    header: i18next.t("Own Goals"),
  },
  {
    accessorKey: "attended_games",
    header: i18next.t("Attended Games"),
  },
];
