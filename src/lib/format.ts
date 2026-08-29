import type { Post } from "./types";

const dateFormat = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

/**
 * Datum eines Beitrags. Drei nachträglich angelegte Quartalsrückblicke tragen in
 * WordPress das Datum ihrer Eingabe statt des Zeitraums, über den sie berichten —
 * bei denen zeigt die Seite nur die Jahreszahl statt eines falschen Tages.
 */
export function formatPostDate(post: Post): string {
  if (!post.showDate) return String(post.year);
  return dateFormat.format(new Date(`${post.date}T12:00:00`));
}

export function formatDateAttribute(post: Post): string {
  return post.showDate ? post.date : String(post.year);
}
