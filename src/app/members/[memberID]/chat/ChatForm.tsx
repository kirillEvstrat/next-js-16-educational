"use client";
import { chatSchema, ChatSchema } from "@/lib/schema/chatSchema";
import { createMessage } from "@/server/actions/messages";
import { Button, InputGroup, toast } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { HiPaperAirplane } from "react-icons/hi2";

export default function ChatForm() {
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
    console.log("Submitting message:", data);
    const result = await createMessage(params.memberID, data);
    if (result.status === "error") {
      toast.danger(result.error as string);
    } else {
      resetField("text");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full items-center gap-2 flex flex-col"
    >
      <InputGroup className="w-full p-2">
        <InputGroup.Input
          aria-label="chat-input"
          placeholder="Type a message..."
          {...register("text")}
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
  );
}
