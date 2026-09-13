import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";

/**
 * On-demand refresh, called by the dashboard's Convex backend
 * (`pentagon-dashboard/convex/site.ts`) after every content change.
 *
 * Marks all Convex content stale. Nothing is re-rendered here: each page picks
 * up fresh content the next time someone visits it, so one save costs one
 * rebuild per page actually viewed — not a rebuild of the whole site.
 */
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  const given = request.headers.get("authorization")?.replace(/^Bearer /, "") ?? "";

  if (!secret || !safeEqual(given, secret)) {
    return Response.json({ ok: false }, { status: 401 });
  }

  revalidateTag("content", "max");
  return Response.json({ ok: true });
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}
