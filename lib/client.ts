"use client";

import { ConvexHttpClient } from "convex/browser";
import type {
  FunctionArgs,
  FunctionReference,
  FunctionReturnType,
} from "convex/server";

/**
 * Convex from the browser, without a provider.
 *
 * The site's client components only ever *post* — a booking, an enquiry, a
 * newsletter sign-up — or ask a one-off question (is this promo code valid?).
 * None of that needs a live subscription, so a plain HTTP client is both lighter
 * than `ConvexProvider` and one less thing wrapped around every page.
 *
 * Reactive reads belong to the dashboard, and content reads happen on the server
 * in `lib/content.ts`.
 */

let client: ConvexHttpClient | null | undefined;

function getClient(): ConvexHttpClient | null {
  if (client !== undefined) return client;
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  client = url ? new ConvexHttpClient(url) : null;
  return client;
}

/** True when a Convex deployment is configured for this build. */
export function isConvexReady() {
  return getClient() !== null;
}

const NOT_CONFIGURED =
  "We could not reach our booking system. Please call 0803 383 3628 and we will take care of it.";

export async function runQuery<Ref extends FunctionReference<"query">>(
  reference: Ref,
  args: FunctionArgs<Ref>,
): Promise<FunctionReturnType<Ref>> {
  const convex = getClient();
  if (!convex) throw new Error(NOT_CONFIGURED);
  return await convex.query(reference, args);
}

export async function runMutation<Ref extends FunctionReference<"mutation">>(
  reference: Ref,
  args: FunctionArgs<Ref>,
): Promise<FunctionReturnType<Ref>> {
  const convex = getClient();
  if (!convex) throw new Error(NOT_CONFIGURED);
  return await convex.mutation(reference, args);
}

/** Convex prefixes thrown errors with call-site noise; show only the message. */
export function cleanError(error: unknown, fallback = "Something went wrong.") {
  if (!(error instanceof Error)) return fallback;
  const match = error.message.match(/Uncaught Error:\s*(.*?)(\n|$)/);
  return (match?.[1] ?? error.message).trim() || fallback;
}
