import { differenceInYears, formatDistanceToNow } from "date-fns";
import { format } from "date-fns";

export function calculateAge(birthDate: string | Date): number {
  return differenceInYears(new Date(), new Date(birthDate));
}

export function formatShortDateTime(date: Date): string {
  return format(date, "dd MM yy h:mm:a");
}

export function timeAgo(date: string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function createChatId(a: string, b: string): string {
  return a < b ? `private-${a}-${b}` : `private-${b}-${a}`;
}
