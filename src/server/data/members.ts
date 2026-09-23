import { cacheLife, cacheTag } from "next/cache";
import { prisma } from "@/lib/prisma";

// Deliberately not in a "use server" module: this is a read, not a publicly-callable action.
export async function getMemberById(memberID: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(`member:${memberID}`);

  return prisma.member.findUnique({
    where: { userID: memberID },
  });
}
