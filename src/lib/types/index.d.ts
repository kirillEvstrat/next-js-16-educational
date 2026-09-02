import { $ZodIssue } from "zod/v4/core";

type ActionResults<T> =
  | {
      status: "success";
      data: T;
    }
  | { status: "error"; error: string | $ZodIssue[] };

type UserFilters = {
  ageRange: [number, number];
  orderBy: string;
  gender: string[];
  withPhotos: boolean;
} & PaginationParams;

type PaginationParams = {
  page?: number;
  pageSize?: number;
};

type PaginatedResponce<T> = {
  items: T[];
  totalCount: number;
};

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
