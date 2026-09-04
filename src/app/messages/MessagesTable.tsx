"use client";

import React, {
  useRef,
  useTransition,
  useEffect,
  useCallback,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { Button, Table, toast, useOverlayState } from "@heroui/react";
import { AiFillDelete } from "react-icons/ai";
import Link from "next/link";
import {
  deleteMessage,
  getMessagesByContainer,
} from "@/server/actions/messages";
import PresenceAvatar from "@/components/PresenceAvatar";
import { useMessageStore } from "@/lib/hooks/useMessageStore";
import { useShallow } from "zustand/shallow";
import { MessageDto } from "@/lib/types";
import { formatShortDateTime } from "@/lib/utils";
import AppModal from "@/components/AppModal";

type MessageRow = {
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

type Props = {
  initialMessages: MessageRow[];
  activeContainer: "inbox" | "outbox";
  currentUserId: string;
  initNextCursor?: string;
};

export default function MessagesTable({
  initialMessages,
  activeContainer,
  currentUserId,
  initNextCursor,
}: Props) {
  const counterpartLabel =
    activeContainer === "outbox" ? "Recipient" : "Sender";
  const [isDeleting, startDeleting] = useTransition();
  const [isLoadingMore, startLoadingMore] = useTransition();
  const router = useRouter();
  const initMessages = useRef(initialMessages);
  const [cursor, setCursor] = React.useState(initNextCursor);
  const [selectedMessage, setSelectedMessage] = useState<MessageDto | null>(
    null,
  );
  const deleteState = useOverlayState();

  const { set, remove, messages, updateUnreadCount, resetMessages } =
    useMessageStore(
      useShallow((state) => ({
        set: state.set,
        remove: state.remove,
        messages: state.messages,
        updateUnreadCount: state.updateUnreadCount,
        resetMessages: state.resetMessages,
      })),
    );

  const loadMore = useCallback(() => {
    if (!cursor) return;

    startLoadingMore(async () => {
      const { messages: newMessages, nextCursor } =
        await getMessagesByContainer(activeContainer, cursor);
      set(newMessages);
      setCursor(nextCursor);
    });
  }, [activeContainer, cursor, set]);

  const hasMore = !!cursor;

  useEffect(() => {
    set(initMessages.current);

    return () => {
      resetMessages();
    };
  }, [set, activeContainer, resetMessages]);

  const handleDeleteMessage = (message: MessageDto) => {
    startDeleting(async () => {
      const res = await deleteMessage(message.id, activeContainer === "outbox");
      if (res.status === "error") {
        toast.danger(res.error as string);
      } else {
        remove(message.id);
        if (!message.dateRead && activeContainer === "inbox") {
          updateUnreadCount(-1);
        }
      }
      router.refresh();
    });
  };

  const openConfirModal = (messsage: MessageDto) => {
    setSelectedMessage(messsage);
    deleteState.open();
  };

  const handleConfirmDelete = () => {
    if (selectedMessage) {
      handleDeleteMessage(selectedMessage);
    }
    deleteState.close();
  };

  if (!messages.length) {
    return (
      <div className="flex h-full min-h-0 items-center justify-center p-4">
        <p className="text-sm text-foreground/60">
          No messages in this container yet.
        </p>
      </div>
    );
  }

  return (
    <div className="max-h-[60vh] min-h-0 overflow-y-auto p-4">
      <Table>
        <Table.Content aria-label="Messages table" className="min-w-full">
          <Table.Header>
            <Table.Column isRowHeader>{counterpartLabel}</Table.Column>
            <Table.Column>Message</Table.Column>
            <Table.Column>Date</Table.Column>
            <Table.Column className="w-14 text-center"> </Table.Column>
          </Table.Header>

          <Table.Body>
            {messages.map((message) => {
              const isOutgoing = message.senderId === currentUserId;
              const counterpartId = isOutgoing
                ? message.recipientId
                : message.senderId;
              const counterpartName = isOutgoing
                ? message.recipientName
                : message.senderName;
              const counterpartImage = isOutgoing
                ? message.recipientImage
                : message.senderImage;
              const chatHref = `/members/${counterpartId}/chat`;
              const isUnreadIncoming =
                activeContainer === "inbox" && message.dateRead === null;

              return (
                <Table.Row
                  key={message.id}
                  className={`cursor-pointer hover:bg-content2/60 ${isUnreadIncoming ? "bg-warning-50/80" : ""}`}
                >
                  <Table.Cell>
                    <Link href={chatHref} className="block w-full">
                      <div className="flex items-center gap-3">
                        <PresenceAvatar
                          userId={counterpartId}
                          src={counterpartImage}
                        />
                        <span
                          className={`${isUnreadIncoming ? "font-semibold text-foreground" : "font-medium"}`}
                        >
                          {counterpartName}
                        </span>
                      </div>
                    </Link>
                  </Table.Cell>

                  <Table.Cell>
                    <Link href={chatHref} className="block w-full">
                      <p
                        className={`line-clamp-2 text-sm ${isUnreadIncoming ? "font-semibold text-foreground" : "text-foreground/80"}`}
                      >
                        {message.text}
                      </p>
                    </Link>
                  </Table.Cell>

                  <Table.Cell>
                    <Link href={chatHref} className="block w-full">
                      <div className="flex flex-col gap-1 text-xs text-foreground/60">
                        <span>
                          {formatShortDateTime(new Date(message.created))}
                        </span>
                        {activeContainer === "outbox" && (
                          <span>{message.dateRead ? "Read" : "Sent"}</span>
                        )}
                      </div>
                    </Link>
                  </Table.Cell>

                  <Table.Cell>
                    <div className="flex justify-center">
                      <Button
                        isIconOnly
                        isPending={isDeleting}
                        size="sm"
                        variant="danger-soft"
                        aria-label="Delete message"
                        onClick={() => openConfirModal(message)}
                      >
                        <AiFillDelete size={14} />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Content>
        <Table.Footer>
          <Button
            variant="primary"
            isDisabled={!hasMore}
            isPending={isLoadingMore}
            onClick={loadMore}
          >
            {hasMore ? "Load More" : "No More Messages"}
          </Button>
        </Table.Footer>
      </Table>
      <AppModal
        state={deleteState}
        title="Confirm Delete"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => deleteState.close()}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </div>
        }
      >
        Are you sure you want to delete this message?
      </AppModal>
    </div>
  );
}
