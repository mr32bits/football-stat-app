export let thousandsSeparator = Number(1000).toLocaleString().charAt(1);
export let decimalSeparator = Number(1.1).toLocaleString().charAt(1);

import { CountUpPlugin } from "countup.js";
export interface DecimalCountUpOptions {
  decimalSeparator?: string;
  suffix?: string;
}
export class DecimalCountUp implements CountUpPlugin {
  private options: DecimalCountUpOptions;
  private defaults: DecimalCountUpOptions = {
    decimalSeparator: ".",
    suffix: "",
  };
  constructor(options?: DecimalCountUpOptions) {
    this.options = {
      ...this.defaults,
      ...options,
    };
  }

  render(elem: HTMLElement, formatted: string): void {
    const [integer, decimal] = formatted.split(
      this.options.decimalSeparator || ""
    );
    elem.innerHTML = `<span>${integer}<span class="text-muted-foreground align-top text-xs sm:text-xl">${
      this.options.decimalSeparator
    }${decimal || "00"}${this.options.suffix}</span></span>`;
  }
}

export const locale = new Intl.Locale(navigator.language);

export function parseDateOnly(dateStr: string) {
  const datePatterns = [
    { regex: /^\d{4}-\d{1,2}-\d{1,2}$/, parser: (s: string) => new Date(s) }, // YYYY-MM-DD
    {
      regex: /^\d{1,2}-\d{1,2}-\d{4}$/,
      parser: (s: string) => {
        const [d, m, y] = s.split("-");
        return new Date(`${y}-${m}-${d}`);
      },
    },
    { regex: /^\d{4}\/\d{1,2}\/\d{1,2}$/, parser: (s: string) => new Date(s) }, // YYYY/MM/DD
    {
      regex: /^\d{1,2}\/\d{1,2}\/\d{4}$/,
      parser: (s: string) => {
        const [m, d, y] = s.split("/");
        return new Date(`${y}-${m}-${d}`);
      },
    },
    {
      regex: /^\d{1,2}\.\d{1,2}\.\d{4}$/,
      parser: (s: string) => {
        const [d, m, y] = s.split(".");
        return new Date(`${y}-${m}-${d}`);
      },
    },
  ];

  for (let { regex, parser } of datePatterns) {
    if (regex.test(dateStr)) {
      const date = parser(dateStr);
      if (!isNaN(date.getTime())) {
        date.setHours(0, 0, 0, 0); // remove time
        return date;
      }
    }
  }

  return null; // Not a valid recognized date format
}
export function dateFormat(value: string | Date) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
  }).format(new Date(value));
}

export const tableNumberFilter = (
  input: string,
  key: string,
  value: number | undefined,
  positve: boolean = false,
  range: boolean = false
): boolean => {
  if (!value) return false;

  key = key.trim();
  if (!key.endsWith(":")) {
    key = key + ":";
  }
  input = input.replace(key, "");
  const match = input.match(/(>|<|>=|<=|=|==)?([-+]?\d*\.?\d*[\.\d])/);

  if (!match) return false;

  const operator = match[1];

  if (range) {
    let rngMatch = input.match(/([-+]?\d*\.?\d*[\.\d])-([-+]?\d*\.?\d*[\.\d])/);
    if (rngMatch) {
      console.log(rngMatch);
      const rng1 = parseFloat(rngMatch[1]);
      const rng2 = parseFloat(rngMatch[2]);
      if (rng1 <= rng2) {
        if (value >= rng1 && value <= rng2) return true;
      } else {
        return false;
      }
    }
  }

  let num = parseFloat(match[2]);
  if (isNaN(num)) {
    return false;
  }

  if (positve && num < 0) {
    num = num * -1;
  }

  if (operator === ">") return value > num;
  else if (operator === "<") return value < num;
  else if (operator === ">=") return value >= num;
  else if (operator === "<=") return value <= num;
  else if (operator === "=" || operator === "==") return value == num;
  return value === num;
};

export const tableDateFilter = (
  input: string,
  key: string,
  date: string | Date
): boolean => {
  key = key.trim();
  if (!key.endsWith(":")) {
    key = key + ":";
  }

  const parts = input.replace(key, "").split(":");
  const filterType = parts[0]; // "before" / "after" / exact date
  const filterDate = parts[1]
    ? parseDateOnly(parts[1])
    : parseDateOnly(parts[0]);
  console.log(
    parts[0],
    ", ",
    parts[1],
    " = ",
    parts,
    filterDate,
    new Date(date)
  );
  if (!filterDate) {
    console.log("Not a valid date:", filterDate);
    return false;
  }
  if (typeof date === "string") {
    const parsedDate = parseDateOnly(date);
    if (parsedDate) date = parsedDate;
  }
  if (filterType === "before") return new Date(date) < filterDate;
  if (filterType === "after") return new Date(date) > filterDate;
  return new Date(date).getTime() === filterDate.getTime();
};
