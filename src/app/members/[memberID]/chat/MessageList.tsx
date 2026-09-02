"use client";
import { getPusherClient } from "@/lib/pusher-client";
import { MessageDto } from "@/lib/types";
import Channel from "pusher-js/types/src/core/channels/channel";
import React, { useCallback, useEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";
import { markMessagesAsRead } from "@/server/actions/messages";
import { useMessageStore } from "@/lib/hooks/useMessageStore";
import ChatForm from "./ChatForm";
import { useParams, usePathname } from "next/navigation";
import { Chip } from "@heroui/react";

type Props = {
  initialMessages: MessageDto[];
  currentUser: {
    id: string;
    name: string;
  };
  chatId: string;
  readCount: number;
};

export default function MessageList({
  initialMessages,
  currentUser,
  chatId,
  readCount,
}: Props) {
  const [messages, setMessages] = useState<MessageDto[]>(initialMessages);
  const channelRef = useRef<Channel | null>(null);
  const updateUnreadCount = useMessageStore((store) => store.updateUnreadCount);
  const countUpdated = useRef(false);
  const [typingName, setTypingName] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTyping = useCallback((name: string) => {
    setTypingName(name);
    setIsTyping(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
  }, []);

  const handleNewMessage = useCallback(
    async ({ message }: { message: MessageDto }) => {
      setMessages((prevMessages) => [...prevMessages, message]);

      if (message.senderId !== currentUser.id) {
        await markMessagesAsRead([message.id], message.senderId);
      }
    },

    [currentUser.id],
  );

  const handleReadMessages = useCallback((messageIds: string[]) => {
    setMessages((prevMessages) =>
      prevMessages.map((message) => {
        if (message.dateRead === null && messageIds.includes(message.id)) {
          return { ...message, dateRead: new Date().toISOString() };
        }
        return message;
      }),
    );
  }, []);

  useEffect(() => {
    if (!countUpdated.current) {
      updateUnreadCount(-readCount);
      countUpdated.current = true;
    }
  }, [readCount, updateUnreadCount]);

  useEffect(() => {
    if (!channelRef.current) {
      channelRef.current = getPusherClient().subscribe(chatId);
      channelRef.current.bind("message:new", handleNewMessage);
      channelRef.current.bind("messages:read", handleReadMessages);
      channelRef.current.bind("client-typing", handleTyping);
    }

    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
        channelRef.current.unbind_all();
        channelRef.current = null;
      }
    };
  }, [chatId, handleNewMessage, handleReadMessages, handleTyping]);

  const triggerTyping = () => {
    if (channelRef.current) {
      channelRef.current.trigger("client-typing", currentUser.name);
    }
  };

  return (
    <div className="flex flex-col flex-1 relative">
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-3 py-2">
        <ul className="m-0 w-full list-none space-y-1 p-0">
          {messages?.map((message) => (
            <li key={message.id} className="w-full">
              <MessageBox message={message} currentUserId={currentUser.id} />
            </li>
          ))}
          {!messages?.length && (
            <li className="flex min-h-full items-center justify-center py-12">
              <p className="text-sm text-foreground/60">
                No messages yet. Say hello to start the conversation.
              </p>
            </li>
          )}
        </ul>
      </div>
      {isTyping && (
        <Chip
          color="accent"
          variant="secondary"
          className="absolute bottom-16 left-3 text-sm text-foreground/60"
        >
          {`${typingName} is typing...`}
        </Chip>
      )}
      <ChatForm triggerTyping={triggerTyping} />
    </div>
  );
}
