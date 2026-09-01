import { PrismaClientKnownRequestError } from "../../generated/prisma/internal/prismaNamespace";
import { ActionResults } from "./types";

export function handlePrismaError<T>(error: unknown): ActionResults<T> {
  if (
    error instanceof PrismaClientKnownRequestError ||
    error instanceof Error
  ) {
    return { status: "error", error: error.message };
  }
  return { status: "error", error: "Something went wrong" };
}
