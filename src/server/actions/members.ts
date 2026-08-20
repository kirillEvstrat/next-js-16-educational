import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cache } from "react";

export async function getMembers() {
  const currentUser = await getCurrentUser();
  if (!currentUser) return null;

  try {
    return prisma.member.findMany({
      where: { NOT: { userID: currentUser.id } },
    });
  } catch (error) {
    console.error("Error fetching members:", error);
  }
}

export const getMemberById = cache(async (memberID: string) => {
  try {
    return prisma.member.findUnique({
      where: { userID: memberID },
    });
  } catch (error) {
    console.error("Error fetching member by ID:", error);
  }
});
