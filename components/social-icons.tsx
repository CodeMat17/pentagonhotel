/**
 * Brand marks, drawn inline.
 *
 * lucide-react dropped its brand icons, and pulling a second icon package for
 * three glyphs is not worth the bytes. These inherit `currentColor` and take the
 * same className as the lucide icons around them.
 */

type IconProps = { className?: string };

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export function XIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M17.53 3H20.5l-6.49 7.42L21.64 21h-5.97l-4.68-6.11L5.63 21H2.66l6.94-7.93L2.36 3h6.12l4.23 5.59zm-1.04 16.2h1.64L7.6 4.71H5.83z" />
    </svg>
  );
}

export function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m0 1.67c2.2 0 4.27.86 5.82 2.42a8.19 8.19 0 0 1 2.42 5.83c0 4.54-3.7 8.24-8.25 8.24a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.39c0-4.54 3.7-8.24 8.25-8.24M8.4 6.98c-.17 0-.45.06-.68.31-.24.25-.9.88-.9 2.15s.92 2.49 1.05 2.66c.13.17 1.8 2.75 4.37 3.85.61.26 1.09.42 1.46.54.61.2 1.17.17 1.61.1.49-.07 1.51-.62 1.73-1.22.21-.6.21-1.11.15-1.22-.07-.1-.24-.17-.5-.29-.25-.13-1.51-.75-1.74-.83-.24-.09-.41-.13-.58.12-.17.26-.67.84-.82 1.01-.15.17-.3.2-.56.07-.25-.13-1.08-.4-2.06-1.27-.76-.68-1.28-1.52-1.43-1.77-.15-.26-.02-.4.11-.52.12-.12.26-.3.39-.46.13-.16.17-.27.26-.44.08-.17.04-.33-.02-.46-.07-.12-.58-1.4-.79-1.92-.21-.5-.42-.43-.58-.44z" />
    </svg>
  );
}
