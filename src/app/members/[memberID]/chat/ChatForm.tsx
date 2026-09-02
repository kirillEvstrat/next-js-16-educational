"use client";
import { chatSchema, ChatSchema } from "@/lib/schema/chatSchema";
import { createMessage } from "@/server/actions/messages";
import { Button, InputGroup, toast } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { HiPaperAirplane } from "react-icons/hi2";

export default function ChatForm({
  triggerTyping,
}: {
  triggerTyping: () => void;
}) {
  const params = useParams<{ memberID: string }>();
  const {
    register,
    handleSubmit,
    resetField,
    formState: { isSubmitting },
  } = useForm<ChatSchema>({
    resolver: zodResolver(chatSchema),
  });

  const onSubmit = async (data: ChatSchema) => {
    const result = await createMessage(params.memberID, data);
    if (result.status === "error") {
      toast.danger(result.error as string);
    } else {
      resetField("text");
    }
  };

  const { onChange, ...registerProps } = register("text");

  return (
    <div className="shrink-0 border-t border-default-200 bg-content1 px-1 py-2">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full items-center gap-2 flex flex-col"
      >
        <InputGroup className="w-full p-2">
          <InputGroup.Input
            aria-label="chat-input"
            placeholder="Type a message..."
            {...registerProps}
            onChange={async (e) => {
              await onChange(e);
              triggerTyping();
            }}
          ></InputGroup.Input>
          <InputGroup.Suffix>
            <Button
              isIconOnly
              type="submit"
              isPending={isSubmitting}
              isDisabled={isSubmitting}
              className={"rounded-full z-10"}
            >
              <HiPaperAirplane size={18} />
            </Button>
          </InputGroup.Suffix>
        </InputGroup>
      </form>
    </div>
  );
}
