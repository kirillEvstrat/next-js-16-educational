import React from "react";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { MessageDto } from "../types";

type MessageState = {
  messages: MessageDto[];
  unreadCount: number;
  add: (message: MessageDto) => void;
  remove: (id: string) => void;
  set: (messages: MessageDto[]) => void;
  updateUnreadCount: (amount: number) => void;
};

export const useMessageStore = create<MessageState>()(
  devtools(
    (set) => ({
      messages: [],
      unreadCount: 0,
      add: (message: MessageDto) =>
        set(
          (state) => ({ messages: [message, ...state.messages] }),
          false,
          "message/add",
        ),
      remove: (id: string) =>
        set(
          (state) => ({
            messages: state.messages.filter((message) => message.id !== id),
          }),
          false,
          "message/remove",
        ),
      set: (messages: MessageDto[]) => set({ messages }, false, "message/set"),
      updateUnreadCount: (amount: number) =>
        set(
          (state) => ({ unreadCount: state.unreadCount + amount }),
          false,
          "message/updateUnreadCount",
        ),
    }),
    { name: "message-store" },
  ),
);
