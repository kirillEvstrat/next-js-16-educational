"use server";
import { chatSchema, ChatSchema } from "@/lib/schema/chatSchema";
import { ActionResults } from "@/lib/types";
import { Message } from "../../../generated/prisma/client";
import { requireAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { mapMessageToMessageDTO } from "@/lib/mappings";
import { handlePrismaError } from "@/lib/utils";

export async function createMessage(
  recipientUserId: string,
  data: ChatSchema,
): Promise<ActionResults<Message>> {
  try {
    const user = await requireAuthUser();

    const validated = chatSchema.safeParse(data);

    if (!validated.success)
      return { status: "error", error: validated.error.issues[0].message };

    const { text } = validated.data;

    const message = await prisma.message.create({
      data: {
        text,
        recipientId: recipientUserId,
        senderId: user.id,
      },
    });

    revalidatePath(`/members/${recipientUserId}/chat`);

    return { status: "success", data: message };
  } catch (error) {
    return handlePrismaError(error);
  }
}

export async function getMessageThread(recipientUserId: string) {
  try {
    const user = await requireAuthUser();

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            recipientId: recipientUserId,
            senderId: user.id,
            senderDeleted: false,
          },
          {
            recipientId: user.id,
            senderId: recipientUserId,
            recipientDeleted: false,
          },
        ],
      },
      orderBy: { createdAt: "asc" },
      select: messageSelect,
    });

    if (messages.length > 0) {
      await prisma.message.updateMany({
        where: {
          senderId: recipientUserId,
          recipientId: user.id,
          dateRead: null,
        },
        data: {
          dateRead: new Date(),
        },
      });
    }

    return messages.map((message) => mapMessageToMessageDTO(message));
  } catch (error) {
    return handlePrismaError(error);
  }
}

export async function getMessagesByContainer(container: string = "inbox") {
  try {
    const user = await requireAuthUser();

    const isOutbox = container === "outbox";

    const messages = await prisma.message.findMany({
      where: {
        ...(isOutbox
          ? { senderId: user.id, senderDeleted: false }
          : { recipientId: user.id, recipientDeleted: false }),
      },
      orderBy: { createdAt: "desc" },
      select: messageSelect,
    });

    return messages.map((message) => mapMessageToMessageDTO(message));
  } catch (error) {
    return handlePrismaError(error);
  }
}

export async function getMessageContainerCounts() {
  try {
    const user = await requireAuthUser();

    const [inbox, outbox] = await prisma.$transaction([
      prisma.message.count({
        where: {
          recipientId: user.id,
          recipientDeleted: false,
        },
      }),
      prisma.message.count({
        where: {
          senderId: user.id,
          senderDeleted: false,
        },
      }),
    ]);

    return { inbox, outbox };
  } catch (error) {
    throw new Error(
      "Failed to fetch message container counts: " + (error as Error).message,
    );
  }
}

const messageSelect = {
  id: true,
  text: true,
  createdAt: true,
  dateRead: true,
  sender: {
    select: {
      userID: true,
      name: true,
      image: true,
    },
  },
  recipient: {
    select: {
      userID: true,
      name: true,
      image: true,
    },
  },
};

export async function deleteMessage(
  messageId: string,
  isOutbox: boolean,
): Promise<ActionResults<void>> {
  const selector = isOutbox ? "senderDeleted" : "recipientDeleted";

  try {
    const user = await requireAuthUser();
    await prisma.message.update({
      where: { id: messageId },
      data: {
        [selector]: true,
      },
    });

    const messagesToDelete = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: user.id, senderDeleted: true, recipientDeleted: true },
          { recipientId: user.id, recipientDeleted: true, senderDeleted: true },
        ],
      },
    });

    if (messagesToDelete.length > 0) {
      await prisma.message.deleteMany({
        where: {
          id: { in: messagesToDelete.map((msg) => msg.id) },
        },
      });
    }

    revalidatePath(`/messages/${user.id}/chat`);
    revalidatePath(`/messages`);

    return { status: "success", data: undefined };
  } catch (error) {
    return handlePrismaError(error);
  }
}
