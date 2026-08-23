import { MessageWithSenderRecipient } from "./types";
import type { MessageDto } from "./types";
import { formatShortDateTime } from "./utils";

export function mapMessageToMessageDTO(
  message: MessageWithSenderRecipient,
): MessageDto {
  return {
    id: message.id,
    text: message.text,
    created: formatShortDateTime(message.createdAt),
    dateRead: message.dateRead ? formatShortDateTime(message.dateRead) : null,
    senderId: message.sender.userID,
    senderName: message.sender.name,
    senderImage: message.sender.image,
    recipientId: message.recipient.userID,
    recipientName: message.recipient.name,
    recipientImage: message.recipient.image,
  };
}
