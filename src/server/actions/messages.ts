"use server";
import { chatSchema, ChatSchema } from "@/lib/schema/chatSchema";
import { ActionResults } from "@/lib/types";
import type { MessageDto } from "@/lib/types";
import { requireAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { mapMessageToMessageDTO } from "@/lib/mappings";
import { handlePrismaError } from "@/lib/server-utils";
import { createChatId } from "@/lib/utils";
import { pusherServer } from "@/lib/pusher";

export async function createMessage(
  recipientUserId: string,
  data: ChatSchema,
): Promise<ActionResults<MessageDto>> {
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
      select: messageSelect,
    });

    const messageDTO = mapMessageToMessageDTO(message);

    await pusherServer.trigger(
      createChatId(user.id, recipientUserId),
      "message:new",
      {
        message: messageDTO,
      },
    );

    await pusherServer.trigger("private-" + recipientUserId, "message:new", {
      message: messageDTO,
    });

    revalidatePath(`/members/${recipientUserId}/chat`);

    return { status: "success", data: messageDTO };
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

    let readCount = 0;

    if (messages.length > 0) {
      const readMessageIds = messages
        .filter(
          (m) =>
            m.dateRead === null &&
            m.recipient?.userID === user.id &&
            m.sender?.userID === recipientUserId,
        )
        .map((m) => m.id);

      await prisma.message.updateMany({
        where: { id: { in: readMessageIds } },
        data: {
          dateRead: new Date(),
        },
      });

      await pusherServer.trigger(
        createChatId(recipientUserId, user.id),
        "messages:read",
        readMessageIds,
      );

      readCount = readMessageIds.length;
    }

    return {
      messages: messages.map((message) => mapMessageToMessageDTO(message)),
      readCount,
    };
  } catch (error) {
    throw error;
  }
}

export async function markMessagesAsRead(
  messageIds: string[],
  senderId: string,
) {
  const user = await requireAuthUser();

  await prisma.message.updateMany({
    where: { id: { in: messageIds } },
    data: {
      dateRead: new Date(),
    },
  });

  await pusherServer.trigger(
    createChatId(senderId, user.id),
    "messages:read",
    messageIds,
  );
}

export async function getMessagesByContainer(
  container: string = "inbox",
  cursor?: string,
  limit = 2,
) {
  try {
    const user = await requireAuthUser();

    const isOutbox = container === "outbox";

    const messages = await prisma.message.findMany({
      where: {
        ...(isOutbox
          ? { senderId: user.id, senderDeleted: false }
          : { recipientId: user.id, recipientDeleted: false }),
        ...(cursor ? { createdAt: { lte: new Date(cursor) } } : {}),
      },
      orderBy: { createdAt: "desc" },
      select: messageSelect,
      take: limit + 1,
    });

    let nextCursor: string | undefined;

    if (messages.length > limit) {
      const nextMessage = messages.pop();
      nextCursor = nextMessage?.createdAt.toISOString();
    } else {
      nextCursor = undefined;
    }

    return {
      messages: messages.map((message) => mapMessageToMessageDTO(message)),
      nextCursor,
    };
  } catch (error) {
    throw error;
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

export async function getUnreadMessageCount(): Promise<number> {
  try {
    const user = await requireAuthUser();
    const count = await prisma.message.count({
      where: {
        recipientId: user.id,
        recipientDeleted: false,
        dateRead: null,
      },
    });
    return count;
  } catch (error) {
    throw error;
  }
}
