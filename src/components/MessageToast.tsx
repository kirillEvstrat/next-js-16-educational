import { toast, Toast } from "@heroui/react";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import type { MessageDto } from "../lib/types";

export default function messageToast(message: MessageDto) {
  return toast(
    <Link
      href={`/members/${message.senderId}/chat`}
      className="font-semibold hover:underline"
    >
      {message.senderName}
    </Link>,
    {
      indicator: (
        <Image
          src={message.senderImage || ""}
          alt={message.senderName}
          width={40}
          height={40}
        />
      ),
      description: (
        <Link
          href={`/members/${message.senderId}/chat`}
          className="font-semibold hover:underline"
        >
          click to view
        </Link>
      ),
      timeout: 5000,
    },
  );
}
