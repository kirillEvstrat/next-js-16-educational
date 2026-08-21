"use server";
import { requireAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleLikeMember(targetUserId: string, isLiked: boolean) {
  try {
    const user = await requireAuthUser();

    if (isLiked) {
      await prisma.like.delete({
        where: {
          sourceUserId_targetUserId: {
            sourceUserId: user.id,
            targetUserId,
          },
        },
      });
    } else {
      await prisma.like.create({
        data: {
          sourceUserId: user.id,
          targetUserId,
        },
      });
    }

    revalidatePath("/members");
    revalidatePath(`/members/${targetUserId}`);
  } catch (error) {
    console.error("Error toggling like member:", error);
  }
}

export async function fetchCurrentUserLikeIds() {
  try {
    const user = await requireAuthUser();
    const likes = await prisma.like.findMany({
      where: {
        sourceUserId: user.id,
      },
      select: {
        targetUserId: true,
      },
    });

    return likes.map((like) => like.targetUserId);
  } catch (error) {
    console.error("Error fetching current user like IDs:", error);
    throw error;
  }
}

export async function fetchLikedMembers(type = "target") {
  try {
    const user = await requireAuthUser();

    switch (type) {
      case "target":
        return await fetchTargetLikes(user.id);
      case "source":
        return await fetchSourceLikes(user.id);

      case "mutual":
        return await fetchMutualLikes(user.id);
      default:
        return [];
    }
  } catch (error) {
    console.error("Error fetching liked members:", error);
    throw error;
  }
}

async function fetchTargetLikes(id: string) {
  const targets = await prisma.like.findMany({
    where: {
      sourceUserId: id,
    },
    select: {
      targetMember: true,
    },
  });
  return targets.map((target) => target.targetMember);
}
async function fetchSourceLikes(id: string) {
  const sources = await prisma.like.findMany({
    where: {
      targetUserId: id,
    },
    select: {
      sourceMember: true,
    },
  });
  return sources.map((source) => source.sourceMember);
}
async function fetchMutualLikes(id: string) {
  const likedIds = await fetchTargetLikes(id).then((members) =>
    members.map((member) => member.userID),
  );
  const mutualLikes = await prisma.like.findMany({
    where: {
      AND: [
        {
          targetUserId: id,
        },
        {
          sourceUserId: {
            in: likedIds,
          },
        },
      ],
    },
    select: {
      sourceMember: true,
    },
  });
  return mutualLikes.map((like) => like.sourceMember);
}
