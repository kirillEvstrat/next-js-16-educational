"use client";
import { authClient } from "@/lib/auth-client";
import { useNotification } from "@/lib/hooks/useNotification";
import { usePresense } from "@/lib/hooks/usePresence";
import React, { Suspense, useEffect, useRef } from "react";
import { useMessageStore } from "@/lib/hooks/useMessageStore";
import { getUnreadMessageCount } from "@/server/actions/messages";

function NotificationProvider({ userId }: { userId: string | null }) {
  useNotification(userId);
  return null;
}

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

  return (
    <>
      <Suspense fallback={null}>
        <NotificationProvider userId={userId} />
      </Suspense>
      {children}
    </>
  );
}
