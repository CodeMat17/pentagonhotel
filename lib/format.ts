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
