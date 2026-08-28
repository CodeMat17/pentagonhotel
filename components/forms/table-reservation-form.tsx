"use client";

import { useState } from "react";
import { format, startOfToday } from "date-fns";
import { CalendarCheckIcon, LoaderCircleIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cleanError, runMutation } from "@/lib/client";
import { m } from "@/lib/convex";
import type { DiningVenue } from "@/lib/content";
import { site } from "@/lib/site";

const times = [
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30",
];

const partySizes = Array.from({ length: 12 }, (_, index) => String(index + 1));

const timeItems = times.map((time) => ({ value: time, label: time }));
const partyItems = partySizes.map((size) => ({
  value: size,
  label: `${size} ${size === "1" ? "guest" : "guests"}`,
}));

/** Table booking for the restaurants — single-date calendar, not a range. */
export function TableReservationForm({
  diningVenues,
}: {
  diningVenues: DiningVenue[];
}) {
  const today = startOfToday();

  const venueItems = diningVenues.map((item) => ({
    value: item.slug,
    label: item.name,
  }));

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [venue, setVenue] = useState(diningVenues[0]?.slug ?? "");
  const [time, setTime] = useState("19:00");
  const [party, setParty] = useState("2");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();

    if (!date) {
      toast.error("Pick a date for your table");
      return;
    }
    if (name.trim().length < 2) {
      toast.error("We need a name for the table");
      return;
    }
    if (phone.replace(/\D/g, "").length < 10) {
      toast.error("Add a phone number", {
        description: "We call to confirm tables on the day.",
      });
      return;
    }

    const venueName =
      diningVenues.find((item) => item.slug === venue)?.name ?? "the restaurant";

    setPending(true);
    try {
      await runMutation(m.sendMessage, {
        kind: "table-reservation",
        name,
        // Tables are confirmed by phone, so an email is not asked for.
        email: "tables@pentagonhotelandsuites.com",
        phone,
        subject: `${party} at ${venueName}, ${format(date, "EEE d MMM")} at ${time}`,
        body: notes || "No special requests.",
        details: [
          { label: "Venue", value: venueName },
          { label: "Date", value: format(date, "yyyy-MM-dd") },
          { label: "Time", value: time },
          { label: "Party size", value: party },
        ],
      });

      toast.success("Table requested", {
        description: `${party} at ${venueName}, ${format(date, "EEE d MMM")} at ${time}. We'll call ${phone} to confirm.`,
        duration: 8000,
      });

      setName("");
      setPhone("");
      setNotes("");
    } catch (error) {
      toast.error("We couldn't send that", {
        description: cleanError(
          error,
          `Please call ${site.phone.display} to book your table.`,
        ),
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="grid gap-8 rounded-2xl bg-card p-6 ring-1 ring-foreground/10 lg:grid-cols-[auto_1fr] lg:p-8"
    >
      <div>
        <Label className="mb-3 block text-sm font-bold">Date</Label>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={{ before: today }}
          captionLayout="dropdown"
          className="rounded-lg border"
        />
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="venue">Where</Label>
          <Select
            items={venueItems}
            value={venue}
            onValueChange={(value) => setVenue(value as string)}
          >
            <SelectTrigger id="venue" className="mt-2 h-11 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {venueItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="time">Time</Label>
            <Select
              items={timeItems}
              value={time}
              onValueChange={(value) => setTime(value as string)}
            >
              <SelectTrigger id="time" className="mt-2 h-11 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="party">Party size</Label>
            <Select
              items={partyItems}
              value={party}
              onValueChange={(value) => setParty(value as string)}
            >
              <SelectTrigger id="party" className="mt-2 h-11 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {partyItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="table-name">Name</Label>
            <Input
              id="table-name"
              value={name}
              autoComplete="name"
              onChange={(event) => setName(event.target.value)}
              className="mt-2 h-11"
            />
          </div>
          <div>
            <Label htmlFor="table-phone">Phone</Label>
            <Input
              id="table-phone"
              type="tel"
              value={phone}
              autoComplete="tel"
              onChange={(event) => setPhone(event.target.value)}
              className="mt-2 h-11"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="table-notes">Anything we should know?</Label>
          <Textarea
            id="table-notes"
            rows={3}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Allergies, a birthday, a quiet corner…"
            className="mt-2"
          />
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={pending}
          className="h-12 w-full bg-brand font-extrabold text-brand-foreground hover:bg-brand/90"
        >
          {pending ? (
            <>
              <LoaderCircleIcon className="animate-spin" /> Sending…
            </>
          ) : (
            <>
              <CalendarCheckIcon /> Request this table
            </>
          )}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Tables are held for 15 minutes. For parties over 12, call{" "}
          {site.phone.display}.
        </p>
      </div>
    </form>
  );
}
