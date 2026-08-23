import { getCurrentUser } from "@/lib/auth";
import { getMemberById } from "@/server/actions/members";
import { notFound } from "next/navigation";
import React from "react";
import ProfileForm from "./ProfileForm";

export default async function MemberDetailedPage(
  props: PageProps<"/members/[memberID]">,
) {
  const { memberID } = await props.params;
  const member = await getMemberById(memberID);
  const user = await getCurrentUser();

  if (!member) {
    return notFound();
  }

  const isCurrentUser = user?.id === member.userID;

  return (
    <div>
      {isCurrentUser ? (
        <ProfileForm member={member} />
      ) : (
        <div>{member.description}</div>
      )}
    </div>
  );
}
