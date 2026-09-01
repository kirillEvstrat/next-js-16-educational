import React from "react";
import ChatForm from "./ChatForm";
import { getMessageThread } from "@/server/actions/messages";
import { getCurrentUser } from "@/lib/auth";
import MessageList from "./MessageList";
import { unauthorized } from "next/navigation";
import { createChatId } from "@/lib/utils";

export default async function ChatPage(
  props: PageProps<"/members/[memberID]/chat">,
) {
  const { memberID } = await props.params;
  const currentUser = await getCurrentUser();
  const { messages, readCount } = await getMessageThread(memberID);

  if (!currentUser) return unauthorized();

  const chatId = createChatId(currentUser.id, memberID);

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden">
      <MessageList
        initialMessages={messages}
        currentUser={currentUser}
        chatId={chatId}
        readCount={readCount}
      />
    </div>
  );
}
