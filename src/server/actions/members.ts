"use server";
import { getCurrentUser, requireAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  profileEditSchema,
  type ProfileEditSchema,
} from "@/lib/schema/profileEditSchema";
import { ActionResults, UserFilters, PaginatedResponce } from "@/lib/types";
import { revalidatePath, updateTag } from "next/cache";
import { Member } from "../../../generated/prisma/client";
import { cloudinary } from "@/lib/cloudinary";
import { addYears } from "date-fns";
import { User } from "../../../generated/prisma/browser";
import { ProfileSchema } from "@/lib/schema/resisterSchema";

export async function getMembers(
  params: UserFilters,
): Promise<PaginatedResponce<Member>> {
  const currentUser = await requireAuthUser();

  const ageRange = params.ageRange?.toString()?.split(",").map(Number) || [
    18, 100,
  ];
  const currentDate = new Date();
  const minDob = addYears(currentDate, -ageRange[1]);
  const maxDob = addYears(currentDate, -ageRange[0]);
  const orderBySelector = params.orderBy || "updated";
  const selectedGender = params.gender
    ? params.gender
        .toString()
        .split(",")
        .filter((g) => g !== "none")
    : ["male", "female"];
  const pageNumber = Number(params.page) || 1;
  const pageSize = Number(params.pageSize) || 12;
  const withPhotos = String(params.withPhotos) === "true";

  const whereSelector = {
    AND: [
      { dateOfBirth: { gte: minDob, lte: maxDob } },
      { gender: { in: selectedGender } },
      ...(withPhotos ? [{ image: { not: null } }] : []),
    ],
    NOT: { userID: currentUser.id },
  };

  try {
    const [items, totalCount] = await Promise.all([
      prisma.member.findMany({
        where: whereSelector,
        orderBy: {
          [orderBySelector]: "desc",
        },
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
      }),
      prisma.member.count({
        where: whereSelector,
      }),
    ]);
    return { items, totalCount };
  } catch (error) {
    console.error("Error fetching members:", error);
    return { items: [], totalCount: 0 };
  }
}

export async function updateProfile(
  data: ProfileEditSchema,
): Promise<ActionResults<Member>> {
  const user = await requireAuthUser();
  const validated = profileEditSchema.safeParse(data);

  // Expected error: bad input is a normal return value, not a throw.
  if (!validated.success) {
    return { status: "error", error: validated.error.issues };
  }

  // Anything the DB call throws from here is an uncaught bug -- let it
  // propagate to the nearest error.tsx instead of masking it as a toast.
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
  updateTag(`member:${member.userID}`);

  return { status: "success", data: member };
}

export async function getMemberPhotosById(userId: string) {
  try {
    const currentUser = await getCurrentUser();
    const isOwner = currentUser?.id === userId;

    const member = await prisma.member.findUnique({
      where: { userID: userId },
      select: {
        photos: {
          where: isOwner ? {} : { status: "approved" },
        },
      },
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

export async function setMainImage(photoId: string) {
  const user = await requireAuthUser();

  // Status and URL must come from the DB row, never from the caller.
  const photo = await prisma.photo.findFirst({
    where: { id: photoId, status: "approved", member: { userID: user.id } },
  });

  if (!photo) {
    throw new Error("Photo not found, not yours, or not approved");
  }

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
}

export async function deleteImage(photoId: string) {
  const user = await requireAuthUser();

  const photo = await prisma.photo.findFirst({
    where: { id: photoId, member: { userID: user.id } },
  });

  if (!photo) {
    throw new Error("Photo not found or not yours");
  }

  const member = await prisma.member.update({
    where: { userID: user.id },
    data: {
      photos: {
        delete: { id: photo.id },
      },
    },
  });

  // Irreversible third-party call goes last, after ownership is proven.
  if (photo.publicId) {
    await cloudinary.v2.uploader.destroy(photo.publicId);
  }

  revalidatePath(`/members/${member.userID}/photos`);

  return member;
}

export async function updateLastActive() {
  const user = await requireAuthUser();

  if (!user.profileComplete) return;

  prisma.member
    .update({
      where: { userID: user.id },
      data: { updated: new Date() },
    })
    .catch((error) => {
      console.log(error);
    });
}

export async function createMemberProfile(user: User, data: ProfileSchema) {
  try {
    const [member] = await prisma.$transaction([
      prisma.member.create({
        data: {
          userID: user.id,
          name: user.name,
          gender: data.gender,
          description: data.description,
          city: data.city,
          country: data.country,
          dateOfBirth: new Date(data.dateOfBirth),
        },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: {
          profileComplete: true,
        },
      }),
    ]);

    return { status: "success", data: member };
  } catch {
    return { status: "error", error: "failed to create member profile" };
  }
}
