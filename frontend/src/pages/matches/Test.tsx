import { DataTablePagination } from "@/components/data-table-pagination";
import { AddPlayerDialog } from "@/components/dialog";
import { TableSearchField } from "@/components/table-searchfield";
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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { tableDateFilter, tableNumberFilter } from "@/util";
import type {
  ColumnDef,
  RowSelectionState,
  SortingState,
  Updater,
} from "@tanstack/react-table";
import {
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import {
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import i18next from "i18next";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronDown,
  ChevronRight,
  Info,
  Plus,
  Trash2,
} from "lucide-react";
import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";

type SeasonData = {
  season_id: number;
  matches: MatchData[];
};

type MatchData = {
  match_id: number;
  match_uuid: string;
  match_date: string;
  team1_score: number;
  team2_score: number;
};

const ExampleTableWithSubRows: React.FC<{
  data: SeasonData[];
  seasons: { year: number; id: number }[];
}> = ({ data, seasons = [] }) => {
  const columns = React.useMemo<ColumnDef<SeasonData>[]>(
    () => [
      {
        header: i18next.t("Season"),
        accessorKey: "season_id",
        sortDescFirst: true,
        enableSorting: true,
        manualSorting: false,
        cell: ({ row }) => {
          return (
            <div className="flex gap-2 min-w-96">
              {row.getCanExpand() ? (
                <span className="content-center">
                  {row.getIsExpanded() ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </span>
              ) : (
                <span className="h-4 w-4" />
              )}
              <span
                className="flex-1 text-sm
 font-semibold"
              >
                {seasons
                  ? seasons?.find((s) => s.id === row.original.season_id)?.year
                  : "Season for id '" + row.original.season_id + "' not found!"}
              </span>
              <div className="w-16 content-center">
                <span className="flex justify-start items-center gap-1">
                  <span className="text-muted-foreground ">
                    {row.original.matches.length}
                  </span>
                  <span>
                    {i18next.t("Matches", {
                      count: row.original.matches.length,
                    })}
                  </span>
                </span>
              </div>
            </div>
          );
        },
      },
    ],
    [seasons]
  );

  const [rowSelection, setRowSelection] = React.useState<
    Record<number, RowSelectionState>
  >({});

  console.log("rowSelection:", rowSelection);
  function setSeasonRowSelection(
    season_id: number,
    newSelection: RowSelectionState
  ) {
    setRowSelection((prev) => ({
      ...prev,
      [season_id]: newSelection,
    }));
  }
  const [filter, setFilter] = useState("");

  const filteredData = React.useMemo(() => {
    if (!filter) return data;

    return data
      .map((season) => {
        // Filter matches at subtable level
        const filteredMatches = season.matches.filter((match) =>
          filter.split(" ").every((f) => {
            if (f.startsWith("selected")) {
              const selectionValue = f
                .replace("selected", "")
                .trim()
                .toLowerCase();
              const isSelected = !!rowSelection?.[season.season_id];

              if (["!", ":!", ":false"].includes(selectionValue))
                return !isSelected;
              console.log(
                isSelected,
                season,
                !!rowSelection?.[season.season_id]
              );
              return isSelected;
            }
            if (f.startsWith("match_date:")) {
              return tableDateFilter(f, "match_date", match.match_date);
            }
            if (f.startsWith("team1_score:")) {
              return tableNumberFilter(
                f,
                "team1_score",
                match.team1_score,
                true
              );
            }
            if (f.startsWith("team2_score:")) {
              return tableNumberFilter(
                f,
                "team2_score",
                match.team2_score,
                true
              );
            }

            // fallback logic
            return Object.values(match)
              .join(" ")
              .toLowerCase()
              .includes(f.toLowerCase());
          })
        );

        return {
          ...season,
          matches: filteredMatches,
        };
      })
      .filter((season) => {
        // Optionally also filter season row itself
        const seasonMatchesPass = season.matches.length > 0;

        const seasonFilterPass = filter.split(" ").every((f) => {
          if (f.startsWith("season:")) {
            return tableNumberFilter(
              f,
              "season",
              seasons.find((s) => s.id === season.season_id)?.year,
              true
            );
          }
          // Add fallback match for season_id
          return String(season.season_id).includes(f.toLowerCase());
        });

        return seasonFilterPass || seasonMatchesPass;
      });
  }, [filter, data, seasons]);

  const table = useReactTable({
    data: filteredData || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      sorting: [
        {
          id: "season_id",
          desc: true, // sort by name in descending order by default
        },
      ],
    },
    enableExpanding: true,
    getRowCanExpand: (row) => !!row.original?.matches?.length,
  });

  const HIGHLIGHT_RULES = [
    {
      regex: /\b(season|selected):?/gi,
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
    <>
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
                            .season_id
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
                    //handleDelete();
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

      <div className="rounded-md border">
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="text-xs">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <Fragment key={row.id}>
                  <TableRow
                    key={row.id}
                    {...(row.getCanExpand() && {
                      onClick: row.getToggleExpandedHandler(),
                      style: { cursor: "pointer" },
                    })}
                  >
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <TableCell
                          key={cell.id}
                          className={
                            "justify-center whitespace-nowrap p-3 text-left align-middle"
                          }
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                  {row.original.matches && row.getIsExpanded() && (
                    <TableRow key={row.id + "expansion"}>
                      <TableCell
                        colSpan={row.getVisibleCells().length}
                        className="px-5"
                      >
                        <SubTable
                          key={row.id}
                          season_id={row.original.season_id}
                          matches={
                            filteredData.find(
                              (v) => v.season_id === row.original.season_id
                            )?.matches || []
                          }
                          filter={filter}
                          rowSelection={
                            rowSelection[row.original.season_id] || {}
                          }
                          setRowSelection={setSeasonRowSelection}
                        />
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
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
      </div>
    </>
  );
};

const SubTable: React.FC<{
  season_id: number;
  matches: MatchData[];
  filter: string;
  rowSelection: RowSelectionState;
  setRowSelection: any;
}> = ({ season_id, matches, filter, rowSelection, setRowSelection }) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const columns = React.useMemo<ColumnDef<MatchData>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            className=" h-4 w-4 p-0"
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => {
              table.toggleAllPageRowsSelected(!!value);
            }}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            className=" h-4 w-4 p-0"
            checked={row.getIsSelected()}
            onCheckedChange={(value) => {
              row.toggleSelected(!!value);
            }}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
      },
      {
        accessorKey: "match_date",
        header: "Match Date",
        cell: ({ row }) => (
          <Link
            to={`/match/${row.original.match_uuid}`}
            className="text-muted-foreground hover:underline"
          >
            {row.original.match_date}
          </Link>
        ),
      },
      { header: "Team 1 Score", accessorKey: "team1_score" },
      { header: "Team 2 Score", accessorKey: "team2_score" },
    ],
    []
  );

  const table = useReactTable({
    data: matches || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableSortingRemoval: true,
    enableMultiSort: true,
    getRowId: (row) => row.match_uuid,
    isMultiSortEvent: () => true,
    state: {
      sorting,
      rowSelection,
    },
    onRowSelectionChange: (newSelection) => {
      setRowSelection((prev: RowSelectionState) => ({
        ...prev,
        [season_id]: newSelection,
      }));
    },
  });

  return (
    <>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
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
                        false: <ArrowUpDown className="w-4 h-4 opacity-50" />,
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
              ))}
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {i18next.t("Warning.NoResults")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <DataTablePagination table={table} />
    </>
  );
};

export default ExampleTableWithSubRows;
