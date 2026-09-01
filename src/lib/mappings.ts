import { MessageWithSenderRecipient } from "./types";
import type { MessageDto } from "./types";

export function mapMessageToMessageDTO(
  message: MessageWithSenderRecipient,
): MessageDto {
  return {
    id: message.id,
    text: message.text,
    created: message.createdAt.toISOString(),
    dateRead: message.dateRead ? message.dateRead.toISOString() : null,
    senderId: message.sender.userID,
    senderName: message.sender.name,
    senderImage: message.sender.image,
    recipientId: message.recipient.userID,
    recipientName: message.recipient.name,
    recipientImage: message.recipient.image,
  };
}
