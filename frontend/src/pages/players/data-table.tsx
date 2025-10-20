"use client";

import {
  ColumnDef,
  RowSelectionState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useState } from "react";

import i18next from "@/translation/translation";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Info,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { PlayerData } from "./columns";
import { tableNumberFilter } from "@/util";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { AddPlayerDialog } from "@/components/dialog";
import { DataTablePagination } from "@/components/data-table-pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { API_URL } from "@/constants/constants";
import { useNavigate } from "react-router-dom";
import { TableSearchField } from "@/components/table-searchfield";

interface DataTableProps<PlayerData, TValue> {
  columns: ColumnDef<PlayerData, TValue>[];
  data: PlayerData[];
}

export function DataTable<_TData, TValue>({
  columns,
  data,
}: DataTableProps<PlayerData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  const [filter, setFilter] = useState("");

  const navigate = useNavigate();

  const filteredData = React.useMemo(() => {
    if (!filter) return data; // No filter applied

    return data.filter((item) => {
      return filter.split(" ").every((f) => {
        {
          /*if (f.startsWith("date:")) {
          return tableDateFilter(f, "ownGoals", "15.Feb.2025");
        }*/
        }
        if (f.startsWith("selected")) {
          const selectionValue = f.replace("selected", "").trim().toLowerCase();
          const isSelected = !!rowSelection?.[item.uuid];
          if (["!", ":!", ":false"].includes(selectionValue))
            return !isSelected;
          return isSelected;
        }
        if (f.startsWith("name:")) {
          return item.name.includes(f.replace("name:", "").trim());
        }
        if (f.startsWith("ownGoals:")) {
          return tableNumberFilter(f, "onwGoals", item.own_goals, true);
        }
        if (f.startsWith("goals:")) {
          return tableNumberFilter(f, "goals", item.goals, true);
        }
        if (f.startsWith("games:")) {
          return tableNumberFilter(f, "games", item.attended_games, true);
        }

        {
          const searchableFields: (keyof PlayerData)[] = [
            "name",
            "goals",
            "own_goals",
            "attended_games",
          ];
          if (
            searchableFields.some((key) =>
              String(item[key]).toLowerCase().includes(f.toLowerCase())
            )
          ) {
            return true;
          }
        }
      });
    });
  }, [filter, data, rowSelection]);
  const table = useReactTable({
    data: filteredData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    getRowId: (row) => row.uuid,

    onSortingChange: setSorting,
    enableSortingRemoval: true,
    enableMultiSort: true,
    isMultiSortEvent: () => true,
    state: {
      sorting,
      rowSelection,
    },
  });
  async function handleDelete() {
    if (table.getFilteredSelectedRowModel().rows.length > 0) {
      try {
        const response = await fetch(`${API_URL}/deleteplayers`, {
          method: "DELETE",
          body: JSON.stringify({
            data: table
              .getFilteredSelectedRowModel()
              .rows.map((r) => r.original),
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(
            `Server error: ${response.status} ${response.statusText}`
          );
        }
        const data = await response.json();
        console.log("Success:", data);
      } catch (error) {
        console.error("Request failed:", error);
      }
      navigate("/players");
    } else {
      console.warn("WARNING: Zero Element Selected");
    }
  }
  const HIGHLIGHT_RULES = [
    {
      regex: /\b(name|goals|ownGoals|games|selected):/gi,
      className: "text-blue-500 bg-blue-500/50 rounded-sm ",
    },
    {
      regex: /(>=|<=|==|=|=>|<|>)/gi,
      className: "text-pink-500 bg-pink-500/50 rounded-sm",
    },
    {
      regex: /(true)/gi,
      className: "text-green-500 bg-green-500/50 rounded-sm",
    },
    {
      regex: /(false|!)/gi,
      className: "text-red-500 bg-red-500/50 rounded-sm",
    },
  ];
  return (
    <div>
      <TableSearchField
        filter={filter}
        setFilter={setFilter}
        infoHoverCard={
          <HoverCard>
            <HoverCardTrigger>
              <Button size="icon" variant="outline">
                <Info className="w-8 h-8" />
              </Button>
            </HoverCardTrigger>
            <HoverCardContent sideOffset={5} className="w-full">
              <div className="flex justify-content space-x-4">
                <Info
                  className="w-8 h-8 mt-1.5"
                  stroke="hsl(var(--muted-foreground))"
                />
                <div className="space-y-1 ">
                  <h4 className="text-sm font-semibold">
                    {i18next.t("ColumnFilter")}
                  </h4>
                  <p className="text-sm">{i18next.t("ColumnFilterInfo")}</p>
                  <div className="border rounded-md p-2 ">
                    <p className="text-sm font-bold text-muted-foreground">
                      {i18next.t("Examples")}:{" "}
                    </p>
                    <div className="text-sm italic text-muted-foreground">
                      <p>name:Alice</p>
                      <p>goals/ownGoals/games:{">="}2</p>
                      <p>selected:true/false/!</p>
                    </div>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        }
        addElement={
          <AddPlayerDialog
            trigger={
              <Button
                size="icon"
                variant="outline"
                title={i18next.t("PlayerPage.AddNewPlayer")}
              >
                <Plus />
              </Button>
            }
          />
        }
        deleteElement={
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                disabled={table.getFilteredSelectedRowModel().rows.length === 0}
              >
                <Trash2 />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {i18next.t("PlayerPage.Delete", {
                    count: table.getFilteredSelectedRowModel().rows.length,
                  })}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {i18next.t("PlayerPage.DeleteInfo", {
                    name:
                      table.getFilteredSelectedRowModel().rows.length === 1
                        ? table.getFilteredSelectedRowModel().rows[0].original
                            .name
                        : "",
                    count: Number(
                      table.getFilteredSelectedRowModel().rows.length
                    ),
                  })}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{i18next.t("Cancel")}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    handleDelete();
                  }}
                >
                  {i18next.t("Delete")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        }
        highlight_rules={HIGHLIGHT_RULES}
      />

      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-left">
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <div
                          className="cursor-pointer select-none flex gap-1"
                          onClick={header.column.getToggleSortingHandler()}
                          title={
                            header.column.getNextSortingOrder() === "asc"
                              ? "Sort ascending"
                              : header.column.getNextSortingOrder() === "desc"
                              ? "Sort descending"
                              : "Clear sort"
                          }
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: (
                              <>
                                <ArrowDown className="w-4 h-4" />[
                                {table
                                  .getState()
                                  .sorting.findIndex(
                                    (s) => s.id === header.column.id
                                  ) + 1}
                                ]
                              </>
                            ),
                            desc: (
                              <>
                                <ArrowUp className="w-4 h-4" />[
                                {table
                                  .getState()
                                  .sorting.findIndex(
                                    (s) => s.id === header.column.id
                                  ) + 1}
                                ]
                              </>
                            ),
                            false: (
                              <ArrowUpDown className="w-4 h-4 opacity-50" />
                            ),
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      ) : (
                        <span className="font-medium">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </span>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {i18next.t("Warning.NoResults")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="m-2">
          <DataTablePagination table={table} />
        </div>
      </div>
    </div>
  );
}
