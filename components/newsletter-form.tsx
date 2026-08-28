"use client";

import { useState, type FormEvent } from "react";
import { SendIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cleanError, runMutation } from "@/lib/client";
import { m } from "@/lib/convex";

/**
 * Newsletter signup. Includes a honeypot field and a submission-timing check —
 * the two cheapest defences against drive-by bot signups, neither of which
 * costs a real guest anything.
 */
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [renderedAt] = useState(() => Date.now());

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const honeypot = (form.elements.namedItem("company") as HTMLInputElement)
      .value;

    // Bots fill hidden fields and submit instantly. Fail silently for both.
    if (honeypot || Date.now() - renderedAt < 1500) {
      setEmail("");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      toast.error("That email doesn't look right", {
        description: "Check the address and try again.",
      });
      return;
    }

    setPending(true);
    try {
      // Re-subscribing an address already on the list is a no-op server-side,
      // so a guest who signs up twice never sees an error.
      await runMutation(m.subscribe, { email, source: "footer" });
      setEmail("");
      toast.success("You're on the list", {
        description:
          "Offers and news, roughly once a month. Never your inbox's problem.",
      });
    } catch (error) {
      toast.error("We couldn't sign you up", {
        description: cleanError(error, "Please try again in a moment."),
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full">
      <label htmlFor="newsletter-email" className="text-sm font-semibold">
        Get our offers first
      </label>
      <p id="newsletter-hint" className="mt-1 mb-3 text-sm text-muted-foreground">
        Package launches and seasonal rates, about once a month. Unsubscribe any time.
      </p>
      <div className="flex gap-2">
        <Input
          id="newsletter-email"
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          aria-describedby="newsletter-hint"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-11 flex-1"
        />
        {/* Honeypot — visually and programmatically hidden from real users. */}
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="pointer-events-none absolute left-[-9999px] size-0 opacity-0"
        />
        <Button
          type="submit"
          size="lg"
          disabled={pending}
          className="h-11 shrink-0 bg-brand px-4 font-bold text-brand-foreground hover:bg-brand/90"
        >
          {pending ? "Sending…" : <>Subscribe <SendIcon /></>}
        </Button>
      </div>
    </form>
  );
}
