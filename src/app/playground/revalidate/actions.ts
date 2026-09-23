"use server";

import { refresh, revalidatePath, revalidateTag, updateTag } from "next/cache";

export async function doUpdateTag() {
  updateTag("demo-tag");
}

export async function doRevalidateTag() {
  revalidateTag("demo-tag", "max");
}

export async function doRevalidatePath() {
  revalidatePath("/playground/revalidate");
}

export async function doRefresh() {
  refresh();
}
