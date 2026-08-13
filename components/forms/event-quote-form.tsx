"use client";

import { useState } from "react";
import { format, startOfToday } from "date-fns";
import { LoaderCircleIcon, SendIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
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
import { eventTypes, venues } from "@/lib/data";
import { site } from "@/lib/site";

const equipmentOptions = [
  "Projector / screen",
  "LED wall",
  "Sound system & microphones",
  "Stage & lighting",
  "Video conferencing",
  "Live streaming",
  "Registration desk",
  "Dedicated event Wi-Fi",
];

const cateringOptions = [
  { value: "none", label: "No catering needed" },
  { value: "tea", label: "Tea & coffee breaks" },
  { value: "lunch", label: "Working lunch" },
  { value: "full", label: "Full day catering" },
  { value: "banquet", label: "Banquet / dinner service" },
  { value: "cocktail", label: "Cocktail reception" },
];

const typeItems = eventTypes.map((type) => ({ value: type, label: type }));
const venueItems = [
  { value: "unsure", label: "Not sure — recommend one" },
  ...venues.map((venue) => ({ value: venue.slug, label: venue.name })),
];

/**
 * Request-a-quote for the event spaces.
 *
 * Everything the events team needs to price a job in one pass: type, date,
 * headcount, room, catering, equipment and contact — so the first reply is a
 * quote rather than a list of questions.
 */
export function EventQuoteForm() {
  const today = startOfToday();

  const [type, setType] = useState(eventTypes[0]);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [guests, setGuests] = useState("100");
  const [venue, setVenue] = useState("unsure");
  const [catering, setCatering] = useState("tea");
  const [equipment, setEquipment] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [pending, setPending] = useState(false);
  const [renderedAt] = useState(() => Date.now());

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const honeypot = (form.elements.namedItem("website") as HTMLInputElement).value;
    if (honeypot || Date.now() - renderedAt < 2000) return;

    if (name.trim().length < 2) {
      toast.error("Add your name so we know who to reply to");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      toast.error("Add a valid email address");
      return;
    }
    if (phone.replace(/\D/g, "").length < 10) {
      toast.error("Add a phone number", {
        description: "Event quotes usually need one quick call.",
      });
      return;
    }
    if (!date) {
      toast.error("Pick a date, even a provisional one");
      return;
    }

    setPending(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setPending(false);

    toast.success("Quote request sent", {
      description: `${type} for ${guests} on ${format(date, "d MMM yyyy")}. Our events team replies within one working day.`,
      duration: 9000,
    });

    setName("");
    setOrganisation("");
    setEmail("");
    setPhone("");
    setNotes("");
    setEquipment([]);
  }

  return (
    <form
      onSubmit={submit}
      className="grid gap-8 rounded-2xl bg-card p-6 ring-1 ring-foreground/10 lg:grid-cols-2 lg:p-8"
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="event-type">Event type</Label>
          <Select
            items={typeItems}
            value={type}
            onValueChange={(value) => setType(value as string)}
          >
            <SelectTrigger id="event-type" className="mt-2 h-11 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {typeItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-2 block">Preferred date</Label>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            disabled={{ before: today }}
            captionLayout="dropdown"
            className="rounded-lg border"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="guests">Expected guests</Label>
            <Input
              id="guests"
              type="number"
              inputMode="numeric"
              min={1}
              max={400}
              value={guests}
              onChange={(event) => setGuests(event.target.value)}
              className="mt-2 h-11"
            />
          </div>
          <div>
            <Label htmlFor="venue-choice">Preferred space</Label>
            <Select
              items={venueItems}
              value={venue}
              onValueChange={(value) => setVenue(value as string)}
            >
              <SelectTrigger id="venue-choice" className="mt-2 h-11 w-full">
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
        </div>

        <div>
          <Label htmlFor="catering">Catering</Label>
          <Select
            items={cateringOptions}
            value={catering}
            onValueChange={(value) => setCatering(value as string)}
          >
            <SelectTrigger id="catering" className="mt-2 h-11 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {cateringOptions.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <fieldset>
          <legend className="text-sm font-semibold">Equipment needed</legend>
          <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
            {equipmentOptions.map((option) => {
              const id = `equip-${option.replace(/\W+/g, "-").toLowerCase()}`;
              return (
                <li key={option} className="flex items-center gap-2.5">
                  <Checkbox
                    id={id}
                    checked={equipment.includes(option)}
                    onCheckedChange={(checked) =>
                      setEquipment((current) =>
                        checked === true
                          ? [...current, option]
                          : current.filter((entry) => entry !== option),
                      )
                    }
                  />
                  <Label htmlFor={id} className="text-sm font-normal">
                    {option}
                  </Label>
                </li>
              );
            })}
          </ul>
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="contact-name">Your name</Label>
            <Input
              id="contact-name"
              value={name}
              autoComplete="name"
              onChange={(event) => setName(event.target.value)}
              className="mt-2 h-11"
            />
          </div>
          <div>
            <Label htmlFor="organisation">Organisation</Label>
            <Input
              id="organisation"
              value={organisation}
              autoComplete="organization"
              onChange={(event) => setOrganisation(event.target.value)}
              className="mt-2 h-11"
            />
          </div>
          <div>
            <Label htmlFor="event-email">Email</Label>
            <Input
              id="event-email"
              type="email"
              value={email}
              autoComplete="email"
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 h-11"
            />
          </div>
          <div>
            <Label htmlFor="event-phone">Phone</Label>
            <Input
              id="event-phone"
              type="tel"
              value={phone}
              autoComplete="tel"
              onChange={(event) => setPhone(event.target.value)}
              className="mt-2 h-11"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="event-notes">Anything else?</Label>
          <Textarea
            id="event-notes"
            rows={5}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Run of show, accommodation for delegates, external caterer, set-up time…"
            className="mt-2"
          />
        </div>

        {/* Honeypot */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="pointer-events-none absolute left-[-9999px] size-0 opacity-0"
        />

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
              <SendIcon /> Request a quote
            </>
          )}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          We reply within one working day. In a hurry? Call {site.phone.display} or
          email {site.email.events}.
        </p>
      </div>
    </form>
  );
}
