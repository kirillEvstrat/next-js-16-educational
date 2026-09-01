"use client";
import { authClient } from "@/lib/auth-client";
import { useNotification } from "@/lib/hooks/useNotification";
import { usePresense } from "@/lib/hooks/usePresence";
import React, { useEffect, useRef } from "react";
import { useMessageStore } from "@/lib/hooks/useMessageStore";
import { getUnreadMessageCount } from "@/server/actions/messages";

export default function Providers({ children }: { children: React.ReactNode }) {
  const session = authClient.useSession();
  const userId = session?.data?.user.id || null;
  const updateUnreadCount = useMessageStore((store) => store.updateUnreadCount);
  const isUnreadCountSet = useRef(false);

  useEffect(() => {
    if (!isUnreadCountSet.current && userId) {
      getUnreadMessageCount().then((count) => {
        updateUnreadCount(count);
        isUnreadCountSet.current = true;
      });
    }
  }, [userId, updateUnreadCount]);

  usePresense(userId); // Pass the userId to the usePresense hook
  useNotification(userId); // Pass the userId to the useNotification hook

  return <>{children}</>;
}
