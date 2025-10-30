import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { NavModeToggle } from "./mode-toggle";
import { useEffect, useId, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import {
  ChevronLeft,
  Home,
  Minus,
  Pen,
  Plus,
  RotateCcw,
  Settings,
  Trash2,
} from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useNavigate } from "react-router-dom";
import { API_URL } from "@/constants/constants";
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
} from "./ui/alert-dialog";
import { AddMatchDialog, AddPlayerDialog } from "./dialog";
import { DatePicker } from "./date-picker";
import { dateFormat, formatDate } from "@/util";
import { Separator } from "./ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useTranslation } from "react-i18next";

export function MenuBar() {
  const { t } = useTranslation();

  useEffect(() => {
    const handleKeyDown = (event: {
      metaKey: any;
      ctrlKey: any;
      key: any;
      preventDefault: () => void;
    }) => {
      if (event.metaKey || event.ctrlKey) {
        switch (event.key) {
          case "k":
            event.preventDefault();
            console.log("Open Command Palette");
            break;
          case "s":
            event.preventDefault();
            if (window.location.pathname.startsWith("/player/")) {
              console.log("currently in a player file");
            }
            console.log("Save File");
            break;
          case "p":
            event.preventDefault();
            console.log("Print Document");
            break;
          default:
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navigate = useNavigate();
  return (
    <Menubar className="mb-5 sticky top-1 z-50 w-full">
      <MenubarMenu>
        <MenubarTrigger
          className="bg-background "
          onClick={() => navigate("/")}
        >
          <Home className="w-4 h-4" />
        </MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className="bg-background">
          {t("Players")}
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem onSelect={() => navigate("/players")}>
            {t("MenuBar.Players.Open")}
            {/*<MenubarShortcut>⌘K</MenubarShortcut>*/}
          </MenubarItem>
          <AddPlayerDialog
            trigger={
              <MenubarItem onSelect={(e) => e.preventDefault()}>
                {t("MenuBar.Players.New")}
              </MenubarItem>
            }
          />
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className="bg-background">
          {t("Matches")}
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem onSelect={() => navigate("/matches")}>
            {t("MenuBar.Matches.Open")}
          </MenubarItem>
          <AddMatchDialog
            trigger={
              <MenubarItem onSelect={(e) => e.preventDefault()}>
                {t("MenuBar.Matches.New")}
              </MenubarItem>
            }
          />
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className="bg-background">File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Save</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <div className="flex-1"></div>
      <MenubarMenu>
        <MenubarTrigger
          className="bg-background"
          onClick={() => location.reload()}
        >
          <RotateCcw className="h-5" />
        </MenubarTrigger>
      </MenubarMenu>

      <div className="justify-self-end">
        <NavModeToggle />
      </div>
    </Menubar>
  );
}

export function PlayerNavBar({
  _name,
  uuid,
  fetchFn,
}: {
  _name: string;
  uuid: string;
  fetchFn: () => any;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const id = useId();
  const [name, setName] = useState(_name);
  const [title, setTitle] = useState(name);

  async function handleSubmit() {
    if (name === _name) {
      console.log("Name did not change, no submit!");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/players/` + uuid, {
        method: "PUT",
        body: JSON.stringify({ player_uuid: uuid, player_name: name }),
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
    fetchFn();
  }
  async function handleDelete() {
    try {
      const response = await fetch(`${API_URL}/players/` + uuid, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(
          `Server error: ${response.status} ${response.statusText}`
        );
      }
      let data = null;
      const text = await response.text();
      if (text) data = JSON.parse(text);
      console.log("Success:", data ?? "Deleted successfully, no response body");
      setTitle("Successfully DELETED");
    } catch (error) {
      console.error("Request failed:", error);
    }
  }

  return (
    <Card className="flex flex-row mb-1 space-y-0 overflow-hidden items-stretch">
      <Button
        variant="ghost"
        size="icon"
        className="border-none bg-transparent rounded-none h-full"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft />
      </Button>
      <div className="flex-1 flex items-center justify-center h-auto border-x">
        <span className="text-sm text-muted-foreground">
          {title ? title : ""}
        </span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="border-none rounded-none h-full"
        onClick={() => console.log("SETTINGS")}
      >
        <Settings />
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="border-y-0 border-r-0 border-l-muted rounded-none h-full"
          >
            <Trash2 />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("PlayerPage.Delete", { count: 1 })}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("PlayerPage.DeleteInfo", { name: _name, count: 1 })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("Cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleDelete();
              }}
            >
              {t("Delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="border-y-0 border-r-0 border-l-muted rounded-none h-full"
          >
            <Pen />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-screen md:w-1/2">
          <SheetHeader>
            <SheetTitle>{t("PlayerPage.Edit")}</SheetTitle>
            <SheetDescription>
              {t("PlayerPage.EditInfo", { name: _name })}
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-2 py-4 my-1">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={id} className="text-right">
                {t("Name")}
              </Label>
              <Input
                id={id}
                defaultValue={_name}
                placeholder={_name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                className="col-span-3"
              />
            </div>
          </div>
          <SheetFooter>
            <div className="flex sm:flex-col flex-row justify-stretch gap-3 w-full">
              <SheetClose asChild>
                <Button type="submit" className="w-full" onClick={handleSubmit}>
                  {t("SaveChanges")}
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button variant="destructive" className="w-full">
                  {t("Cancel")}
                </Button>
              </SheetClose>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </Card>
  );
}

export type SimplifiedPlayerParams = {
  player_uuid: string;
  player_id: number;
  goals_scored: number;
  own_goals_scored: number;
};

export function MatchNavBar({
  match_uuid,
  match_id,
  match_date,
  team_1Players,
  team_2Players,
  team1,
  team2,
  match_season_id,
  fetchFn,
}: {
  match_uuid: string;
  match_id: number;
  match_date: Date | undefined;
  team_1Players: SimplifiedPlayerParams[];
  team_2Players: SimplifiedPlayerParams[];
  team1:
    | {
        id: number;
        team_name: string;
      }
    | undefined;
  team2:
    | {
        id: number;
        team_name: string;
      }
    | undefined;
  match_season_id: number;
  fetchFn: () => any;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const date_id = useId();
  const season_id = useId();

  const [team1Players, setTeam1Players] =
    useState<SimplifiedPlayerParams[]>(team_1Players);
  const [team2Players, setTeam2Players] =
    useState<SimplifiedPlayerParams[]>(team_2Players);

  const [date, setDate] = useState<Date | undefined>(match_date);
  const [seasonID, setSeasonID] = useState<number>(match_season_id);
  const [, setPlayers] = useState<
    { id: number; player_uuid: string; player_name: string }[] | null
  >(null);
  const [possiblePlayers, setPossiblePlayers] = useState<
    { id: number; player_uuid: string; player_name: string }[] | null
  >(null);
  const [seasons, setSeasons] = useState<
    | {
        id: number;
        season_year: number;
      }[]
    | null
  >(null);
  const [, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [playersResponse, seasonResponse] = await Promise.all([
        fetch(`${API_URL}/players/`),
        fetch(`${API_URL}/seasons/`),
      ]);
      if (!playersResponse.ok || !seasonResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const playersData = await playersResponse.json();
      const seasons = await seasonResponse.json();
      console.log("PlayersData:", playersData);
      console.log("SeasonData:", seasons);

      setTimeout(() => {
        setPlayers(playersData);
        if (playersData) setPossiblePlayers(playersData);
        setSeasons(seasons);
        setLoading(false);
      }, 0);
    } catch (error) {
      console.error("API Fetch Error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [match_uuid]);

  async function handleSubmit() {
    try {
      console.log(team1Players, team2Players);
      const response = await fetch(`${API_URL}/matches/` + match_uuid, {
        method: "PUT",
        body: JSON.stringify({
          match_uuid: match_uuid,
          match_id: match_id,
          match_date: formatDate(match_date ? match_date : ""),
          season_id: seasonID,
          team1_id: team1?.id ?? 1,
          team2_id: team2?.id ?? 2,
          team1Players: team1Players
            .filter((p) => p.player_id && p.player_id >= 0)
            .map((p) => ({
              player_uuid: p.player_uuid ?? "",
              player_id: p.player_id ?? -1,
              goals_scored: p.goals_scored ?? 0,
              own_goals_scored: p.own_goals_scored ?? 0,
            })),
          team2Players: team2Players
            .filter((p) => p.player_id && p.player_id >= 0)
            .map((p) => ({
              player_uuid: p.player_uuid ?? "",
              player_id: p.player_id ?? -1,
              goals_scored: p.goals_scored ?? 0,
              own_goals_scored: p.own_goals_scored ?? 0,
            })),
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
    fetchFn();
  }
  async function handleDelete() {
    try {
      const response = await fetch(`${API_URL}/match/` + match_uuid, {
        method: "DELETE",
        body: JSON.stringify({ match_uuid: match_uuid, match_id: match_id }),
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
    navigate("/matches");
  }

  const handleAddTeam1Player = () => {
    const newPlayer = {
      player_uuid: "",
      player_id: -1,
      goals_scored: 0,
      own_goals_scored: 0,
    };
    setTeam1Players([...team1Players, newPlayer]);
  };

  const handleAddTeam2Player = () => {
    const newPlayer = {
      player_uuid: "",
      player_id: -1,
      goals_scored: 0,
      own_goals_scored: 0,
    };
    setTeam2Players([...team2Players, newPlayer]);
  };

  const handleRemoveTeam1Player = () => {
    const lastPlayer = team1Players[team1Players.length - 1];
    if (lastPlayer.player_id === -1 && team1Players.length > 1) {
      setTeam1Players(team1Players.slice(0, -1));
    }
  };
  const handleRemoveTeam2Player = () => {
    const lastPlayer = team2Players[team2Players.length - 1];
    if (lastPlayer.player_id === -1 && team2Players.length > 1) {
      setTeam2Players(team2Players.slice(0, -1));
    }
  };

  const maxRows = Math.max(team1Players.length, team2Players.length);

  return (
    <Card className="flex flex-row mb-1 space-y-0 overflow-hidden items-stretch">
      <Button
        variant="ghost"
        size="icon"
        className="border-none bg-transparent rounded-none h-full"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft />
      </Button>
      <div className="flex-1 flex items-center justify-center h-auto border-x">
        <span className="text-sm text-muted-foreground">
          {match_date ? dateFormat(match_date) : "None or Invalid Date!"}
        </span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="border-none rounded-none h-full"
        onClick={() => console.log("SETTINGS")}
      >
        <Settings />
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="border-y-0 border-r-0 border-l-muted rounded-none h-full"
          >
            <Trash2 />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("MatchPage.Delete")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("MatchPage.DeleteInfo", {
                name: match_date
                  ? dateFormat(match_date)
                  : "None or Invalid Date!",
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("Cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleDelete();
              }}
            >
              {t("Delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="border-y-0 border-r-0 border-l-muted rounded-none h-full"
          >
            <Pen />
          </Button>
        </SheetTrigger>
        <SheetContent className="max-h-screen overflow-y-scroll w-full sm:max-w-screen max-w-[1200px] min-w-[750px]">
          <SheetHeader>
            <SheetTitle>{t("MatchPage.Edit")}</SheetTitle>
            <SheetDescription>
              {t("MatchPage.EditInfo", {
                name: match_date
                  ? dateFormat(match_date)
                  : "None or Invalid Date!",
              })}
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-2 py-4 my-1">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={date_id} className="text-right">
                {t("Match Date")}
              </Label>
              <div id={date_id}>
                <DatePicker date={date ? date : new Date()} set={setDate} />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={season_id} className="text-right">
                {t("Season")}
              </Label>
              <div id={season_id}>
                <Select
                  value={seasonID?.toString() || ""}
                  onValueChange={(value) => {
                    const selectedSeason =
                      (seasons &&
                        seasons.find((s) => s.id === parseInt(value))) ||
                      null;
                    if (selectedSeason) {
                      setSeasonID(selectedSeason.id);
                    }
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={t("Season")} />
                  </SelectTrigger>
                  <SelectContent className="max-h-[160px]">
                    {seasons && seasons?.length > 0 ? (
                      seasons
                        .sort((a, b) => b.season_year - a.season_year)
                        .map((season) => (
                          <SelectItem
                            key={season.id}
                            value={season.id.toString()}
                          >
                            {season.season_year}
                          </SelectItem>
                        ))
                    ) : (
                      <SelectItem value="None" disabled>
                        {t("Error.NoSeason")}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Separator className="my-5" />
          </div>
          <div className="border rounded-xl mt-2 overflow-hidden my-5">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[45%] text-right">Team 1</TableHead>
                  <TableHead className="w-[10%] text-center">:</TableHead>
                  <TableHead className="w-[45%] text-left">Team 2</TableHead>
                </TableRow>
                <TableRow>
                  <TableHead className="w-[45%] text-center">
                    <div className="grid grid-cols-6 items-center gap-2">
                      <span className="col-span-4">{t("Name")}</span>
                      <div className="col-span-1">{t("Own Goals")}</div>
                      <div className="col-span-1">{t("Goals")}</div>
                    </div>
                  </TableHead>
                  <TableHead className="w-[10%] text-center">:</TableHead>
                  <TableHead className="w-[45%] text-center">
                    <div className="grid grid-cols-6 items-center gap-2">
                      <div className="col-span-1">{t("Goals")}</div>
                      <div className="col-span-1">{t("Own Goals")}</div>
                      <span className="col-span-4">{t("Name")}</span>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {maxRows > 0 ? (
                  Array.from({ length: maxRows }).map((_, index) => (
                    <TableRow key={index}>
                      {/* Team 1 Column */}
                      <TableCell className="text-right">
                        {team1Players && team1Players[index] ? (
                          <div className="grid grid-cols-6 items-center gap-2">
                            <Select
                              value={team1Players[index].player_uuid}
                              onValueChange={(val) => {
                                const foundPlayer = possiblePlayers?.find(
                                  (p) => p.player_uuid === val
                                );
                                const updatedPlayer = {
                                  ...team1Players[index],
                                  player_uuid: val,
                                  player_id: foundPlayer?.id ?? -1,
                                  player_name: foundPlayer?.player_name ?? "",
                                  player_match_id: -1,
                                };
                                const newTeam1 = [...team1Players];
                                newTeam1[index] = updatedPlayer;
                                setTeam1Players(newTeam1);
                              }}
                            >
                              <SelectTrigger className="col-span-4">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {possiblePlayers &&
                                possiblePlayers.length > 0 ? (
                                  <>
                                    <SelectItem
                                      className="text-muted-foreground"
                                      value={"None"}
                                      key={"None"}
                                    >
                                      {"-"}
                                    </SelectItem>
                                    <SelectSeparator />
                                  </>
                                ) : (
                                  <></>
                                )}
                                {possiblePlayers &&
                                possiblePlayers.length > 0 ? (
                                  possiblePlayers.map((p) => (
                                    <SelectItem
                                      value={p.player_uuid}
                                      key={p.player_uuid}
                                      disabled={
                                        team1Players.some(
                                          (player, i) =>
                                            i !== index &&
                                            p.player_uuid === player.player_uuid
                                        ) ||
                                        team2Players.some(
                                          (player) =>
                                            p.player_uuid === player.player_uuid
                                        )
                                          ? true
                                          : false
                                      }
                                    >
                                      {p.player_name}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <SelectItem
                                    disabled
                                    value="NotFound"
                                    key={index}
                                  >
                                    {t("Error.PlayerNotFound")}
                                  </SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                            <Input
                              className="col-span-1 text-right"
                              defaultValue={
                                team1Players[index].own_goals_scored
                              }
                              onChange={(e) => {
                                const val = parseInt(e.target.value);
                                if (!isNaN(val) && val >= 0)
                                  team1Players[index].own_goals_scored = val;
                                else {
                                  team1Players[index].own_goals_scored = 0;
                                }
                              }}
                            />
                            <Input
                              className="col-span-1 text-right"
                              defaultValue={team1Players[index].goals_scored}
                              onChange={(e) => {
                                const val = parseInt(e.target.value);
                                if (!isNaN(val) && val >= 0)
                                  team1Players[index].goals_scored = val;
                                else {
                                  team1Players[index].goals_scored = 0;
                                }
                              }}
                            />
                          </div>
                        ) : (
                          "-"
                        )}
                      </TableCell>

                      {/* Separator Column */}
                      <TableCell className="text-center">:</TableCell>

                      {/* Team 2 Column */}
                      <TableCell className="text-left">
                        {team2Players && team2Players[index] ? (
                          <div className="grid grid-cols-6 items-center gap-2">
                            <Input
                              className="col-span-1 text-right"
                              defaultValue={team2Players[index].goals_scored}
                              onChange={(e) => {
                                const val = parseInt(e.target.value);
                                if (!isNaN(val) && val >= 0)
                                  team2Players[index].goals_scored = val;
                                else {
                                  team2Players[index].goals_scored = 0;
                                }
                              }}
                            />
                            <Input
                              className="col-span-1 text-right"
                              defaultValue={
                                team2Players[index].own_goals_scored
                              }
                              onChange={(e) => {
                                const val = parseInt(e.target.value);
                                if (!isNaN(val) && val >= 0)
                                  team2Players[index].own_goals_scored = val;
                                else {
                                  team2Players[index].own_goals_scored = 0;
                                }
                              }}
                            />
                            <Select
                              value={team2Players[index].player_uuid}
                              onValueChange={(val) => {
                                const foundPlayer = possiblePlayers?.find(
                                  (p) => p.player_uuid === val
                                );
                                const updatedPlayer = {
                                  ...team2Players[index],
                                  player_uuid: val,
                                  player_id: foundPlayer?.id ?? -1,
                                  player_name: foundPlayer?.player_name ?? "",
                                  player_match_id: -1,
                                };
                                const newTeam2 = [...team2Players];
                                newTeam2[index] = updatedPlayer;
                                setTeam2Players(newTeam2);
                              }}
                            >
                              <SelectTrigger className="col-span-4 text-left">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {possiblePlayers &&
                                possiblePlayers.length > 0 ? (
                                  <>
                                    <SelectItem
                                      className="text-muted-foreground"
                                      value={"None"}
                                      key={"None"}
                                    >
                                      {"-"}
                                    </SelectItem>
                                    <SelectSeparator />
                                  </>
                                ) : (
                                  <></>
                                )}
                                {possiblePlayers &&
                                possiblePlayers.length > 0 ? (
                                  possiblePlayers.map((p) => (
                                    <SelectItem
                                      value={p.player_uuid}
                                      key={p.player_uuid}
                                      disabled={
                                        team2Players.some(
                                          (player, i) =>
                                            i !== index &&
                                            p.player_uuid === player.player_uuid
                                        ) ||
                                        team1Players.some(
                                          (player) =>
                                            p.player_uuid === player.player_uuid
                                        )
                                          ? true
                                          : false
                                      }
                                    >
                                      {p.player_name}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <SelectItem
                                    disabled
                                    value="NotFound"
                                    key={index}
                                  >
                                    {t("Error.PlayerNotFound")}
                                  </SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center h-24">
                      {t("Warning.NoResults")}
                    </TableCell>
                  </TableRow>
                )}
                <TableRow className="bg-[hsl(var(--muted)/0.5)]">
                  <TableCell>
                    <div className="flex flex-row">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleAddTeam1Player}
                      >
                        <Plus />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleRemoveTeam1Player}
                      >
                        <Minus />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="items-center place-items-center">
                    <div className="border w-0 h-10" />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-row">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleAddTeam2Player}
                      >
                        <Plus />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleRemoveTeam2Player}
                      >
                        <Minus />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <SheetFooter>
            <div className="flex sm:flex-col flex-row justify-stretch gap-3 w-full">
              <SheetClose asChild>
                <Button type="submit" className="w-full" onClick={handleSubmit}>
                  {t("SaveChanges")}
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button variant="destructive" className="w-full">
                  {t("Cancel")}
                </Button>
              </SheetClose>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </Card>
  );
}
