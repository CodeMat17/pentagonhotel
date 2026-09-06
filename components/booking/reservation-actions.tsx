"use client";

import { CalendarPlusIcon, CopyIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { formatTime12 } from "@/lib/format";
import { fullAddress, site } from "@/lib/site";

/**
 * The two things on the reservation page that need the browser: copying the
 * reference, and saving the stay to a calendar.
 *
 * The calendar file is built here rather than fetched from a route because there
 * is nothing to fetch — every field is already on the page. One click, no round
 * trip, and it works on a phone with no signal in the hotel car park.
 */

/** Escapes the characters iCalendar treats as syntax. */
function icsEscape(value: string): string {
  return value.replace(/[\\;,]/g, (match) => `\\${match}`).replace(/\n/g, "\\n");
}

/** `2026-09-15` → `20260915`, the all-day VEVENT date form. */
function icsDate(iso: string): string {
  return iso.replace(/-/g, "");
}

export function CopyReference({ reference }: { reference: string }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="mt-2 font-bold text-brand"
      onClick={() => {
        void navigator.clipboard.writeText(reference);
        toast.success("Reference copied");
      }}
    >
      <CopyIcon /> Copy reference
    </Button>
  );
}

export function AddToCalendar({
  reference,
  roomName,
  checkIn,
  checkOut,
  checkInTime,
}: {
  reference: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  checkInTime: string;
}) {
  function addToCalendar() {
    // All-day events spanning arrival to departure: a hotel stay is not a
    // meeting, and pinning it to an hour would put the wrong thing in the diary.
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      `PRODID:-//${icsEscape(site.name)}//Reservation//EN`,
      "BEGIN:VEVENT",
      `UID:${reference}@${new URL(site.url).hostname}`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]|\.\d{3}/g, "")}`,
      `DTSTART;VALUE=DATE:${icsDate(checkIn)}`,
      `DTEND;VALUE=DATE:${icsDate(checkOut)}`,
      `SUMMARY:${icsEscape(`${site.name} — ${roomName}`)}`,
      `LOCATION:${icsEscape(fullAddress)}`,
      `DESCRIPTION:${icsEscape(
        `Booking ${reference}. Check-in from ${formatTime12(checkInTime)}. Payment is made at the hotel. ${site.url}/reservation/${reference}`,
      )}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ];

    const blob = new Blob([lines.join("\r\n")], {
      type: "text/calendar;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${reference}.ics`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success("Added to your calendar");
  }

  return (
    <Button
      variant="outline"
      size="lg"
      className="h-12 font-bold"
      onClick={addToCalendar}
    >
      <CalendarPlusIcon /> Add to calendar
    </Button>
  );
}
