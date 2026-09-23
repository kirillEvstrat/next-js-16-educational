"use server";

import { revalidateTag, updateTag } from "next/cache";

export async function expireUpdateTagPanel() {
  updateTag("panel-update");
}

export async function expireRevalidateTagPanel() {
  // "max" opts into stale-while-revalidate; omitting it is the deprecated, updateTag-like behaviour.
  revalidateTag("panel-revalidate", "max");
}
