"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { enGB, enUS, de } from "date-fns/locale";

export function DatePicker({
  date = new Date(),
  set,
}: {
  date: Date;
  set: any;
}) {
  const [_date, setDate] = React.useState<Date | undefined>(date);

  const locales = { enUS, enGB, de };
  let locale = locales.enGB;
  console.log("Language: " + new Intl.Locale(navigator.language).language);
  switch (new Intl.Locale(navigator.language).language) {
    case "de":
      locale = locales.de;
      break;
    case "en":
      locale = locales.enUS;
      break;
  }

  console.log("Locale: " + locale.code);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !_date && "text-muted-foreground"
          )}
        >
          <CalendarIcon />
          {_date ? (
            format(_date, "PPP", { locale: locale })
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          locale={locale}
          mode="single"
          selected={_date}
          onSelect={(d) => {
            set(d);
            setDate(d);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
