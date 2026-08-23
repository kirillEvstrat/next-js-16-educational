import React from "react";
import ChatForm from "./ChatForm";
import { getMessageThread } from "@/server/actions/messages";
import MessageBox from "./MessageBox";
import { requireAuthUser } from "@/lib/auth";

export default async function ChatPage(
  props: PageProps<"/members/[memberID]/chat">,
) {
  const { memberID } = await props.params;
  const currentUser = await requireAuthUser();
  const messages = await getMessageThread(memberID);

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden">
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
      <div className="shrink-0 border-t border-default-200 bg-content1 px-1 py-2">
        <ChatForm />
      </div>
    </div>
  );
}
