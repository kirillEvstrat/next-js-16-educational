import { differenceInYears } from "date-fns";
import { format } from "date-fns";
import { ActionResults } from "./types";
import { PrismaClientKnownRequestError } from "../../generated/prisma/internal/prismaNamespace";

export function calculateAge(birthDate: string | Date): number {
  return differenceInYears(new Date(), new Date(birthDate));
}

export function formatShortDateTime(date: Date): string {
  return format(date, "dd MM yy h:mm:a");
}

export function handlePrismaError<T>(error: unknown): ActionResults<T> {
  if (
    error instanceof PrismaClientKnownRequestError ||
    error instanceof Error
  ) {
    return { status: "error", error: error.message };
  }
  return { status: "error", error: "Something went wrong" };
}
