import { Channel } from "pusher-js";
import { useCallback, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { getPusherClient } from "../pusher-client";
import { useMessageStore } from "./useMessageStore";
import { MessageDto } from "../types";
import messageToast from "@/components/MessageToast";
import { User } from "../../../generated/prisma/browser";
import likeToast from "@/components/LikeToast";

export const useNotification = (userId: string | null) => {
  const channelRef = useRef<Channel | null>(null);
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const add = useMessageStore((state) => state.add);
  const updateUnreadCount = useMessageStore((state) => state.updateUnreadCount);

  const handleNewMessage = useCallback(
    ({ message }: { message: MessageDto }) => {
      if (
        pathName === `/messages/` &&
        searchParams.get("container") !== "outbox"
      ) {
        add(message);
        updateUnreadCount(1);
      } else if (pathName !== `/messages/${message.senderId}/chat`) {
        messageToast(message);
        updateUnreadCount(1);
      }
    },
    [add, pathName, searchParams, updateUnreadCount],
  );

  const handleNewLike = useCallback((user: User) => {
    likeToast(user);
  }, []);

  useEffect(() => {
    if (!userId) return;

    if (!channelRef.current) {
      channelRef.current = getPusherClient().subscribe(`private-${userId}`);
    }

    return () => {
      if (channelRef.current && channelRef.current.subscribed) {
        getPusherClient().unsubscribe(`private-${userId}`);
        getPusherClient().unbind_all();
        channelRef.current = null;
      }
    };
  }, [userId]);

  useEffect(() => {
    const channel = channelRef.current;
    if (!channel) return;

    channel.bind("message:new", handleNewMessage);
    channel.bind("like:new", handleNewLike);

    return () => {
      getPusherClient().unbind_all();
    };
  }, [handleNewMessage, handleNewLike]);
};
