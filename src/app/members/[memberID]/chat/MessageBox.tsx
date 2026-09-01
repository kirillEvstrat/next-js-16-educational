"use client";

import React, { useEffect, useRef } from "react";
import type { MessageDto } from "@/lib/types";
import { Avatar } from "@heroui/react";
import classnames from "classnames";
import { timeAgo } from "@/lib/utils";

type Props = {
  message: MessageDto;
  currentUserId: string;
};

export default function MessageBox({ message, currentUserId }: Props) {
  const isCurrentUserSender = message.senderId === currentUserId;
  const messageStatus = message.dateRead
    ? `Read ${timeAgo(message.dateRead)}`
    : "Sent";
  const displayName = isCurrentUserSender ? "You" : message.senderName;
  const avatarAlt = message.senderName || "Sender";
  const avatarSrc = message.senderImage || "/images/user.png";
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [message]);

  const renderAvatar = () => {
    return (
      <div className="self-end">
        <Avatar size="sm">
          <Avatar.Image alt={avatarAlt} src={avatarSrc} />
        </Avatar>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div
        className={classnames("flex gap-2 mb-3 items-end", {
          "justify-end text-right": isCurrentUserSender,
          "justify-start text-left": !isCurrentUserSender,
        })}
      >
        {!isCurrentUserSender && renderAvatar()}
        <div
          className={classnames(
            "flex flex-col px-3 py-2 max-w-[75%] shadow-sm",
            {
              "rounded-2xl rounded-br-md bg-primary text-primary-foreground":
                isCurrentUserSender,
              "rounded-2xl rounded-bl-md bg-content2 text-foreground":
                !isCurrentUserSender,
            },
          )}
        >
          <span
            className={classnames("text-xs mb-1 font-medium", {
              "text-primary-foreground/80": isCurrentUserSender,
              "text-foreground/60": !isCurrentUserSender,
            })}
          >
            {displayName}
          </span>
          <p className="text-sm leading-relaxed wrap-break-word">
            {message.text}
          </p>
          <div
            className={classnames("text-[11px] mt-1 flex items-center gap-1", {
              "text-primary-foreground/70 justify-end": isCurrentUserSender,
              "text-foreground/50 justify-start": !isCurrentUserSender,
            })}
          >
            <span>{message.created}</span>
            {isCurrentUserSender && <span>• {messageStatus}</span>}
          </div>
        </div>
        {isCurrentUserSender && renderAvatar()}
      </div>
      <div ref={messageEndRef} />
    </div>
  );
}
