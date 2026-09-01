"use server";
import { getCurrentUser, requireAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  profileEditSchema,
  type ProfileEditSchema,
} from "@/lib/schema/profileEditSchema";
import { ActionResults } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { cache } from "react";
import { Member, Photo } from "../../../generated/prisma/client";
import { cloudinary } from "@/lib/cloudinary";

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

export async function updateProfile(
  data: ProfileEditSchema,
): Promise<ActionResults<Member>> {
  try {
    const user = await requireAuthUser();
    const validated = profileEditSchema.safeParse(data);

    if (!validated.success) {
      return { status: "error", error: validated.error.issues };
    }

    const member = await prisma.member.update({
      where: { userID: user.id },
      data: {
        ...validated.data,
        user: {
          update: { name: data.name },
        },
      },
    });

    revalidatePath("/members");
    revalidatePath(`/members/${member.userID}`);

    return { status: "success", data: member };
  } catch (error) {
    if (error instanceof Error) {
      return { status: "error", error: error.message };
    } else {
      return { status: "error", error: "An unknown error occurred" };
    }
  }
}

export async function getMemberPhotosById(userId: string) {
  try {
    const member = await prisma.member.findUnique({
      where: { userID: userId },
      select: { photos: true },
    });

    return member?.photos;
  } catch (error) {
    console.error("Error fetching member photos by ID:", error);
  }
}

export async function addImage(url: string, publicId: string) {
  try {
    const user = await requireAuthUser();

    const member = await prisma.member.update({
      where: { userID: user.id },
      data: {
        photos: {
          create: [{ url, publicId }],
        },
      },
    });

    revalidatePath(`/members/${member.userID}/photos`);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function setMainImage(photo: Photo) {
  try {
    const user = await requireAuthUser();

    const result = await prisma.user.update({
      where: { id: user.id },
      data: {
        image: photo.url,
        member: {
          update: {
            image: photo.url,
          },
        },
      },
    });

    revalidatePath(`/members/${user.id}/photos`);
    revalidatePath(`/members/${user.id}`);
    revalidatePath(`/members`);

    return result;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function deleteImage(photo: Photo) {
  try {
    const user = await requireAuthUser();

    if (photo.publicId) {
      await cloudinary.v2.uploader.destroy(photo.publicId);
    }

    const member = await prisma.member.update({
      where: { userID: user.id },
      data: {
        photos: {
          delete: { id: photo.id },
        },
      },
    });

    revalidatePath(`/members/${member.userID}/photos`);

    return member;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
