"use client";

import React from "react";
import { Member } from "../../generated/prisma/browser";
import { usePresenceStore } from "@/lib/hooks/usePresenceStore";
import { GoDot, GoDotFill } from "react-icons/go";

type Props = {
  member: Member;
};

export default function PresenceDot({ member }: Props) {
  const members = usePresenceStore((state) => state.members);
  const isOnline = members.includes(member.userID);

  if (!isOnline) {
    return null; // Don't render anything if the member is offline
  }

  return (
    <>
      <GoDot size={36} className="fill-white absolute" />
      <GoDotFill size={36} className="fill-green-500 animate-pulse" />
    </>
  );
}
