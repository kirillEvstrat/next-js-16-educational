"use server";

import { redirect, unstable_rethrow } from "next/navigation";

export async function brokenRedirect() {
  try {
    redirect("/playground/errors/success");
  } catch (err) {
    // Bug: this catches redirect()'s internal NEXT_REDIRECT signal too,
    // so the navigation silently never happens.
    console.error("[broken] swallowed:", err);
  }
}

export async function fixedRedirect() {
  try {
    redirect("/playground/errors/success");
  } catch (err) {
    unstable_rethrow(err); // let redirect's internal error escape
    console.error("[fixed] real bug would land here:", err);
  }
}

export async function throwBug() {
  // A genuine, unexpected failure -- must NOT be try/caught here.
  // It should propagate up to the nearest error.tsx boundary.
  throw new Error("Deliberate uncaught bug for error.tsx demo");
}
