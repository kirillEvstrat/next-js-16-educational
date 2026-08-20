import { getMemberById } from "@/server/actions/members";
import { notFound } from "next/navigation";
import React from "react";

export default async function MemberDetailedPage(
  props: PageProps<"/members/[memberID]">,
) {
  const { memberID } = await props.params;
  const member = await getMemberById(memberID);

  if (!member) {
    return notFound();
  }

  return <div className="p-10">{member.name}</div>;
}
