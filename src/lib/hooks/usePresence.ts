import { useEffect } from "react";
import { usePresenceStore } from "./usePresenceStore";
import { getPusherClient } from "../pusher-client";
import { Members, PresenceChannel } from "pusher-js";
import { updateLastActive } from "@/server/actions/members";

type PresenceMemeber = {
  id: string;
  info: unknown;
};

export const usePresense = (userId: string | null) => {
  const { set, add, remove } = usePresenceStore();

  useEffect(() => {
    if (!userId) return;

    const handleSetMembers = (membersIds: string[]) => {
      set(membersIds);
    };

    const handleAddMember = (memberId: string) => {
      add(memberId);
    };

    const handleRemoveMember = (memberId: string) => {
      remove(memberId);
    };

    const channel = getPusherClient().subscribe(
      "presence-nm",
    ) as PresenceChannel;

    channel.bind("pusher:subscription_succeeded", (members: Members) => {
      handleSetMembers(Object.keys(members.members));
      updateLastActive();
    });

    channel.bind("pusher:member_added", (member: PresenceMemeber) => {
      handleAddMember(member.id);
    });

    channel.bind("pusher:member_removed", (member: PresenceMemeber) => {
      handleRemoveMember(member.id);
    });

    return () => {
      channel.unbind_all();
    };
  }, [add, remove, set, userId]);
};
