import { CircleCheck, CircleX } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { JSX, useState } from "react";
import { API_URL } from "@/constants/constants";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "./date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { SeasonParams } from "@/pages/match/Match";
import { formatDate } from "@/util";
import { useTranslation } from "react-i18next";

export function AddPlayerDialog({ trigger }: { trigger: JSX.Element }) {
  const { t } = useTranslation();

  const formSchema = z.object({
    player_name: z.string().min(2).max(50).trim(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      player_name: "",
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [responseType, setResponseType] = useState("");
  const navigate = useNavigate();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      const response = await fetch(API_URL + "/players/create/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response;
      form.reset();
      setResponseType(data.status == 201 ? "success" : "error");
      setResponseMessage(
        data.status == 201
          ? "Successfully Added Player"
          : "Error submitting form"
      );
    } catch (error) {
      setResponseType("error");
      setResponseMessage("Failed to connect to server.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const [open, setOpen] = useState(false);
  //const handleOpen = () => setOpen(true);
  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset();
      if (responseMessage === "Player successfully created")
        navigate("/players");
      setResponseMessage("");
      setResponseType("");
      setIsSubmitting(false);
    }
    setOpen(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-lg">
        <DialogHeader>
          <DialogTitle>{t("PlayerPage.AddNewPlayer")}</DialogTitle>
          <DialogDescription>
            {t("PlayerPage.AddNewPlayerInfo")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full max-w-md mx-auto"
          >
            <FormField
              control={form.control}
              name="player_name"
              render={({ field }) => (
                <div>
                  <FormItem className="grid grid-cols-4 gap-4 items-baseline">
                    <FormLabel>{t("Name")}</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        placeholder={t("Name") + "..."}
                        className="col-span-3"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                  <FormMessage className="mt-2" />
                </div>
              )}
            />
            {responseMessage && responseType && (
              <p className="mt-2 text-sm text-muted-foreground flex items-center gap-x-2">
                <span>
                  {responseType === "error" ? <CircleX /> : <CircleCheck />}
                </span>
                {responseMessage}
              </p>
            )}
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t("Saving") : t("SaveChanges")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function AddMatchDialog({ trigger }: { trigger: JSX.Element }) {
  const { t } = useTranslation();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [responseType, setResponseType] = useState("");
  const navigate = useNavigate();

  const [seasons, setSeasons] = useState<SeasonParams[] | null>(null);

  const formSchema = z.object({
    match_date: z.date({
      required_error: "Please select a date and time",
      invalid_type_error: t("Error.InvalidDate"),
    }),
    season_id: z.number().int().nonnegative(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      match_date: new Date(),
      season_id: seasons
        ? seasons.reduce((prev, curr) =>
            prev && prev.season_year > curr.season_year ? prev : curr
          ).id
        : -1,
    },
  });

  const fetchData = async () => {
    try {
      const seasonResponse = await fetch(`${API_URL}/seasons/`);
      if (!seasonResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const seasons: SeasonParams[] = await seasonResponse.json();
      console.log("SeasonData:", seasons);

      setSeasons(seasons);
      form.setValue(
        "season_id",
        seasons
          ? seasons.reduce((prev, curr) =>
              prev && prev.season_year > curr.season_year ? prev : curr
            ).id
          : -1
      );
    } catch (error) {
      console.error("API Fetch Error:", error);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);

      const response = await fetch(API_URL + "/matches/create/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          match_date: formatDate(values.match_date),
          team1_id: 1,
          team2_id: 2,
          season_id: values.season_id,
        }),
      });

      const resp = await response;
      form.reset({
        season_id: seasons
          ? seasons.reduce((prev, curr) =>
              prev && prev.season_year > curr.season_year ? prev : curr
            ).id
          : -1,
      });
      setResponseType(resp.status == 201 ? "success" : "error");
      setResponseMessage(
        resp.status == 201
          ? "Successfully Added Match"
          : "Error submitting form"
      );
    } catch (error) {
      setResponseType("error");
      setResponseMessage("Failed to connect to server.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const [open, setOpen] = useState(false);
  //const handleOpen = () => setOpen(true);
  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset({
        season_id: seasons
          ? seasons.reduce((prev, curr) =>
              prev && prev.season_year > curr.season_year ? prev : curr
            ).id
          : -1,
      });
      if (responseMessage === "Player successfully created")
        navigate("/matches");
      setResponseMessage("");
      setResponseType("");
      setIsSubmitting(false);
    } else {
      fetchData();
    }
    setOpen(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-lg">
        <DialogHeader>
          <DialogTitle>{t("MatchPage.AddNewMatch")}</DialogTitle>
          <DialogDescription>
            {t("MatchPage.AddNewMatchInfo")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full max-w-md mx-auto"
          >
            <FormField
              control={form.control}
              name="match_date"
              render={({ field }) => (
                <div>
                  <FormItem className="grid grid-cols-4 gap-4 items-baseline">
                    <FormLabel>{t("Match Date")}</FormLabel>
                    <FormControl>
                      <DatePicker
                        date={field.value}
                        set={(date: Date | undefined) => field.onChange(date)}
                      />
                    </FormControl>
                  </FormItem>
                  <FormMessage className="mt-2" />
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="season_id"
              render={({ field }) => (
                <div>
                  <FormItem className="grid grid-cols-4 gap-4 items-baseline">
                    <FormLabel>{t("Season")}</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value.toString()}
                        onValueChange={(value) => {
                          const selectedSeason =
                            (seasons &&
                              seasons.find((s) => s.id === parseInt(value))) ||
                            null;
                          if (selectedSeason) {
                            field.onChange(parseInt(value));
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
                    </FormControl>
                  </FormItem>
                  <FormMessage className="mt-2" />
                </div>
              )}
            />
            {responseMessage && responseType && (
              <p className="mt-2 text-sm text-muted-foreground flex items-center gap-x-2">
                <span>
                  {responseType === "error" ? <CircleX /> : <CircleCheck />}
                </span>
                {responseMessage}
              </p>
            )}
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t("Saving") : t("SaveChanges")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
