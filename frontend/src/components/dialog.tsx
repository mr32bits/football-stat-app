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
import i18next from "i18next";
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

export function AddPlayerDialog({ trigger }: { trigger: JSX.Element }) {
  const formSchema = z.object({
    name: z.string().min(2).max(50).trim(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [responseType, setResponseType] = useState("");
  const navigate = useNavigate();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      const response = await fetch(API_URL + "/createplayer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      form.reset();
      setResponseType(data.success ? "success" : "error");
      setResponseMessage(data.success || "Error submitting form");
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
          <DialogTitle>{i18next.t("PlayerPage.AddNewPlayer")}</DialogTitle>
          <DialogDescription>
            {i18next.t("PlayerPage.AddNewPlayerInfo")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full max-w-md mx-auto"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <div>
                  <FormItem className="grid grid-cols-4 gap-4 items-baseline">
                    <FormLabel>{i18next.t("Name")}</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        placeholder={i18next.t("Name") + "..."}
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
                {isSubmitting ? i18next.t("Saving") : i18next.t("SaveChanges")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function AddMatchDialog({ trigger }: { trigger: JSX.Element }) {
  const formSchema = z.object({
    date: z.date({
      required_error: "Please select a date and time",
      invalid_type_error: i18next.t("Error.InvalidDate"),
    }),
    season: z.number().int().nonnegative(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      season: -1,
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [responseType, setResponseType] = useState("");
  const navigate = useNavigate();

  const [seasons, setSeasons] = useState<SeasonParams | null>(null);

  const fetchData = async () => {
    try {
      const seasonResponse = await fetch(`${API_URL}/seasons/`);
      if (!seasonResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const seasons = await seasonResponse.json();
      console.log("SeasonData:", seasons);

      setSeasons(seasons);
    } catch (error) {
      console.error("API Fetch Error:", error);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      const response = await fetch(API_URL + "/match/create/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      form.reset();
      setResponseType(data.success ? "success" : "error");
      setResponseMessage(data.success || "Error submitting form");
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
          <DialogTitle>{i18next.t("MatchPage.AddNewMatch")}</DialogTitle>
          <DialogDescription>
            {i18next.t("MatchPage.AddNewMatchInfo")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full max-w-md mx-auto"
          >
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <div>
                  <FormItem className="grid grid-cols-4 gap-4 items-baseline">
                    <FormLabel>{i18next.t("Match Date")}</FormLabel>
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
              name="season"
              render={({ field }) => (
                <div>
                  <FormItem className="grid grid-cols-4 gap-4 items-baseline">
                    <FormLabel>{i18next.t("Season")}</FormLabel>
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
                          <SelectValue placeholder={i18next.t("Season")} />
                        </SelectTrigger>
                        <SelectContent className="max-h-[160px]">
                          {seasons && seasons?.length > 0 ? (
                            seasons.map((season) => (
                              <SelectItem
                                key={season.id}
                                value={season.id.toString()}
                              >
                                {season.season_year}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="None" disabled>
                              {i18next.t("Error.NoSeason")}
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
                {isSubmitting ? i18next.t("Saving") : i18next.t("SaveChanges")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
