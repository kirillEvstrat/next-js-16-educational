import React from "react";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type PresenceState = {
  members: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
  set: (ids: string[]) => void;
};

export const usePresenceStore = create<PresenceState>()(
  devtools(
    (set) => ({
      members: [],
      add: (id: string) =>
        set(
          (state) => ({ members: [...state.members, id] }),
          false,
          "presence/add",
        ),
      remove: (id: string) =>
        set(
          (state) => ({
            members: state.members.filter((memberId) => memberId !== id),
          }),
          false,
          "presence/remove",
        ),
      set: (ids: string[]) => set({ members: ids }, false, "presence/set"),
    }),
    { name: "presence-store" },
  ),
);
