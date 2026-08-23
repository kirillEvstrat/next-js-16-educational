import { $ZodIssue } from "zod/v4/core";

type ActionResults<T> =
  | {
      status: "success";
      data: T;
    }
  | { status: "error"; error: string | $ZodIssue[] };
