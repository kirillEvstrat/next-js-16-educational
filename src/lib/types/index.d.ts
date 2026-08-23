import { $ZodIssue } from "zod/v4/core";

type ActionResults<T> =
  | {
      status: "success";
      data: T;
    }
  | { status: "error"; error: string | $ZodIssue[] };

type MessageDto = {
  id: string;
  text: string;
  created: string;
  dateRead: string | null;
  senderId: string;
  senderName: string;
  senderImage: string | null;
  recipientId: string;
  recipientName: string;
  recipientImage: string | null;
};

type MessageWithSenderRecipient = Prisma.MessageGetPayload<{
  include: {
    sender: true;
    recipient: true;
  };
}>;
