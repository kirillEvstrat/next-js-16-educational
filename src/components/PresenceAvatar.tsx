"use client";

import { usePresenceStore } from "@/lib/hooks/usePresenceStore";
import { Avatar, Badge } from "@heroui/react";
import React from "react";

type Props = {
  userId: string;
  src?: string | null;
};

export default function PresenceAvatar({ userId, src }: Props) {
  const members = usePresenceStore((state) => state.members);

  const isOnline = members.includes(userId);

  return (
    <Badge.Anchor>
      <Avatar>
        <Avatar.Image src={src || "/images/user.png"} />
      </Avatar>
      {isOnline && <Badge color="success" size="sm" placement="top-right" />}
    </Badge.Anchor>
  );
}
