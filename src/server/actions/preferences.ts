"use server";

import { cookies } from "next/headers";

export async function setMembersView(view: "grid" | "list") {
  const cookieStore = await cookies();
  cookieStore.set("membersView", view, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}
