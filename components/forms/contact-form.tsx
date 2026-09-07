"use client";

import { useState } from "react";
import { LoaderCircleIcon, SendIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
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
import { site } from "@/lib/site";

const subjects = [
  { value: "reservation", label: "A reservation" },
  { value: "events", label: "An event or conference" },
  { value: "dining", label: "Dining or a table booking" },
  { value: "transfer", label: "Airport transfer" },
  { value: "accessibility", label: "Accessibility" },
  { value: "feedback", label: "Feedback about a stay" },
  { value: "other", label: "Something else" },
];

/** General contact form, with the same honeypot + timing guard as the others. */
export function ContactForm({
  /** The hotel switchboard to quote, from the dashboard. Not to be confused
   *  with `phone` below, which is the guest's own number. */
  hotelPhone = site.phone.display,
}: {
  hotelPhone?: string;
}) {
  const [subject, setSubject] = useState("reservation");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [renderedAt] = useState(() => Date.now());
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const honeypot = (form.elements.namedItem("fax") as HTMLInputElement).value;
    if (honeypot || Date.now() - renderedAt < 2000) return;

    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = "Please tell us your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
      next.email = "Enter a valid email address";
    if (message.trim().length < 10)
      next.message = "A little more detail helps us answer properly";
    setErrors(next);

    if (Object.keys(next).length > 0) {
      toast.error("Some fields need a look");
      return;
    }

    setPending(true);
    try {
      // Lands in the dashboard inbox, where reception picks it up.
      await runMutation(m.sendMessage, {
        kind: "contact",
        name,
        email,
        phone,
        subject: subjects.find((item) => item.value === subject)?.label ?? "Enquiry",
        body: message,
        details: [],
      });

      toast.success("Message sent", {
        description: `Thanks ${name.split(" ")[0]} — we reply within one working day, usually much sooner.`,
        duration: 8000,
      });

      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (error) {
      toast.error("We couldn't send that", {
        description: cleanError(
          error,
          `Please call ${hotelPhone} and we'll take it from there.`,
        ),
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-4 rounded-2xl bg-card p-6 ring-1 ring-foreground/10 sm:p-8"
    >
      <div>
        <Label htmlFor="subject">What&apos;s this about?</Label>
        <Select
          items={subjects}
          value={subject}
          onValueChange={(value) => setSubject(value as string)}
        >
          <SelectTrigger id="subject" className="mt-2 h-11 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="contact-name">Your name</Label>
          <Input
            id="contact-name"
            value={name}
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            onChange={(event) => setName(event.target.value)}
            className="mt-2 h-11"
          />
          {errors.name && (
            <p id="contact-name-error" className="mt-1.5 text-xs font-semibold text-destructive">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="contact-phone">Phone (optional)</Label>
          <Input
            id="contact-phone"
            type="tel"
            value={phone}
            autoComplete="tel"
            onChange={(event) => setPhone(event.target.value)}
            className="mt-2 h-11"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="contact-email">Email</Label>
        <Input
          id="contact-email"
          type="email"
          value={email}
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-2 h-11"
        />
        {errors.email && (
          <p id="contact-email-error" className="mt-1.5 text-xs font-semibold text-destructive">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="contact-message">Message</Label>
        <Textarea
          id="contact-message"
          rows={6}
          value={message}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          onChange={(event) => setMessage(event.target.value)}
          className="mt-2"
        />
        {errors.message && (
          <p id="contact-message-error" className="mt-1.5 text-xs font-semibold text-destructive">
            {errors.message}
          </p>
        )}
      </div>

      {/* Honeypot */}
      <input
        type="text"
        name="fax"
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
            <SendIcon /> Send message
          </>
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        We use your details only to answer this message. See our{" "}
        <a href="/privacy" className="font-semibold text-brand underline underline-offset-2">
          privacy policy
        </a>
        . For anything urgent, call {hotelPhone}.
      </p>
    </form>
  );
}
