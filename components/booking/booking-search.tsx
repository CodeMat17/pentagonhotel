"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { addDays, format, isBefore, startOfToday } from "date-fns";
import type { DateRange } from "react-day-picker";
import {
  CalendarDaysIcon,
  MinusIcon,
  PlusIcon,
  SearchIcon,
  UsersIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { nightsBetween } from "@/lib/booking";
import { cn } from "@/lib/utils";

/**
 * The calendar is the heaviest thing in this widget and nobody sees it until
 * they open the date popover — so it loads on demand rather than sitting in the
 * hero's hydration path.
 */
const Calendar = dynamic(
  () => import("@/components/ui/calendar").then((mod) => mod.Calendar),
  {
    ssr: false,
    loading: () => <Skeleton className="m-3 h-72 w-72" />,
  },
);

const iso = (date: Date) => format(date, "yyyy-MM-dd");

/**
 * The availability search that opens the site — in the hero, and again as a
 * compact bar elsewhere. It does not fetch anything: it collects the stay and
 * hands it to /booking, which owns the flow. That keeps the homepage static and
 * the LCP fast.
 */
export function BookingSearch({
  variant = "hero",
  className,
}: {
  variant?: "hero" | "inline";
  className?: string;
}) {
  const router = useRouter();
  const today = startOfToday();

  const [range, setRange] = useState<DateRange | undefined>({
    from: addDays(today, 1),
    to: addDays(today, 3),
  });
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [roomCount, setRoomCount] = useState(1);
  const [monthsShown, setMonthsShown] = useState(1);

  const nights = nightsBetween(range?.from, range?.to);

  const dateLabel = useMemo(() => {
    if (!range?.from) return "Select dates";
    if (!range.to) return `${format(range.from, "d MMM")} — add checkout`;
    return `${format(range.from, "d MMM")} – ${format(range.to, "d MMM yyyy")}`;
  }, [range]);

  const guestLabel = `${adults} adult${adults === 1 ? "" : "s"}${
    children ? `, ${children} child${children === 1 ? "" : "ren"}` : ""
  } · ${roomCount} room${roomCount === 1 ? "" : "s"}`;

  function search() {
    if (!range?.from || !range?.to || nights < 1) {
      toast.error("Choose your dates first", {
        description: "Pick a check-in and a checkout date to see availability.",
      });
      return;
    }
    if (isBefore(range.from, today)) {
      toast.error("Check-in can't be in the past");
      return;
    }
    const params = new URLSearchParams({
      from: iso(range.from),
      to: iso(range.to),
      adults: String(adults),
      children: String(children),
      rooms: String(roomCount),
    });
    router.push(`/booking?${params}`);
  }

  const hero = variant === "hero";

  return (
    <div
      className={cn(
        "rounded-2xl bg-background/95 p-2.5 shadow-xl ring-1 ring-foreground/10 backdrop-blur-xl",
        hero ? "w-full" : "w-full",
        className,
      )}
    >
      <div className="grid gap-2 lg:grid-cols-[1.4fr_1fr_auto]">
        {/* ------------------------------------------------------ dates */}
        <Popover
          onOpenChange={(open) => {
            // Two months side by side only when there's room for them.
            if (open && typeof window !== "undefined") {
              setMonthsShown(window.innerWidth >= 768 ? 2 : 1);
            }
          }}
        >
          <PopoverTrigger
            render={
              <button
                type="button"
                className="flex min-h-14 items-center gap-3 rounded-xl px-4 text-left transition-colors hover:bg-muted focus-visible:bg-muted"
              />
            }
          >
            <CalendarDaysIcon className="size-5 shrink-0 text-brand" />
            <span className="flex flex-col">
              <span className="text-[0.68rem] font-bold tracking-[0.14em] text-muted-foreground uppercase">
                Check-in — Checkout
              </span>
              <span className="text-sm font-bold">
                {dateLabel}
                {nights > 0 && (
                  <span className="ml-2 font-semibold text-muted-foreground">
                    {nights} night{nights === 1 ? "" : "s"}
                  </span>
                )}
              </span>
            </span>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-0">
            <Calendar
              mode="range"
              defaultMonth={range?.from}
              selected={range}
              onSelect={setRange}
              numberOfMonths={monthsShown}
              disabled={{ before: today }}
              className="rounded-lg border-0"
            />
            <div className="border-t p-2.5 text-center text-xs text-muted-foreground">
              Free cancellation on most rates · Best rate when you book direct
            </div>
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="hidden h-auto lg:block" />

        {/* ----------------------------------------------------- guests */}
        <Popover>
          <PopoverTrigger
            render={
              <button
                type="button"
                className="flex min-h-14 items-center gap-3 rounded-xl px-4 text-left transition-colors hover:bg-muted focus-visible:bg-muted"
              />
            }
          >
            <UsersIcon className="size-5 shrink-0 text-brand" />
            <span className="flex flex-col">
              <span className="text-[0.68rem] font-bold tracking-[0.14em] text-muted-foreground uppercase">
                Guests &amp; rooms
              </span>
              <span className="text-sm font-bold">{guestLabel}</span>
            </span>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-80 gap-0 p-4">
            <Stepper
              label="Adults"
              hint="Aged 13 and over"
              value={adults}
              min={1}
              max={12}
              onChange={setAdults}
            />
            <Separator className="my-3" />
            <Stepper
              label="Children"
              hint="Aged 0–12, stay free with an adult"
              value={children}
              min={0}
              max={8}
              onChange={setChildren}
            />
            <Separator className="my-3" />
            <Stepper
              label="Rooms"
              hint="We'll keep them on the same floor"
              value={roomCount}
              min={1}
              max={6}
              onChange={setRoomCount}
            />
          </PopoverContent>
        </Popover>

        {/* ----------------------------------------------------- action */}
        <Button
          size="lg"
          onClick={search}
          className="h-14 gap-2 bg-brand px-7 text-base font-extrabold text-brand-foreground hover:bg-brand/90"
        >
          <SearchIcon className="size-[18px]" />
          Check availability
        </Button>
      </div>
    </div>
  );
}

function Stepper({
  label,
  hint,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  hint: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  const id = `stepper-${label.toLowerCase()}`;
  return (
    <div className="flex items-center justify-between gap-4">
      <span>
        <span id={id} className="block text-sm font-bold">
          {label}
        </span>
        <span className="block text-xs text-muted-foreground">{hint}</span>
      </span>
      <span className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="size-10 rounded-full"
          disabled={value <= min}
          aria-label={`Decrease ${label.toLowerCase()}`}
          onClick={() => onChange(Math.max(min, value - 1))}
        >
          <MinusIcon />
        </Button>
        <output
          aria-labelledby={id}
          aria-live="polite"
          className="w-8 text-center text-sm font-bold tabular-nums"
        >
          {value}
        </output>
        <Button
          variant="outline"
          size="icon"
          className="size-10 rounded-full"
          disabled={value >= max}
          aria-label={`Increase ${label.toLowerCase()}`}
          onClick={() => onChange(Math.min(max, value + 1))}
        >
          <PlusIcon />
        </Button>
      </span>
    </div>
  );
}
