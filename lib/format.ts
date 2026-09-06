const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/**
 * Date formatting that produces identical output on the server and in the
 * browser.
 *
 * `toLocaleDateString` depends on the host's ICU data and time zone, so Node
 * and the browser can disagree — which shows up as a React hydration error.
 * These parse the ISO string by hand and never touch the local time zone.
 */
export function formatDateLong(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

export function formatMonthYear(iso: string): string {
  const [year, month] = iso.split("-").map(Number);
  return `${MONTHS[month - 1]} ${year}`;
}

/**
 * `20:00` → `8pm`, `14:30` → `2:30pm`, `12:00` → `12 noon`.
 *
 * The CMS stores check-in, check-out and the hold time as 24-hour `HH:MM` —
 * that is what a time input produces and what the hold arithmetic parses.
 * Guests do not read clocks that way, so every time on its way to a guest
 * passes through here: the stored value stays canonical, only the reading
 * changes. Kept in step with `clock12` in the dashboard's `convex/notify.ts`,
 * so the reservation page and the confirmation email say the same thing.
 *
 * Anything that is not `HH:MM` is passed through untouched, so staff who type
 * "2 PM" or "noon" into settings get back exactly what they typed.
 */
export function formatTime12(time: string): string {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
  if (!match) return time;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) return time;
  if (minute === 0 && hour === 12) return "12 noon";
  if (minute === 0 && hour === 0) return "midnight";
  const suffix = hour < 12 ? "am" : "pm";
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return minute === 0
    ? `${h12}${suffix}`
    : `${h12}:${String(minute).padStart(2, "0")}${suffix}`;
}
