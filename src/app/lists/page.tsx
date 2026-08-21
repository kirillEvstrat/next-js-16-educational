import {
  fetchCurrentUserLikeIds,
  fetchLikedMembers,
} from "@/server/actions/likes";
import React from "react";
import { ListTabs } from "./ListTabs";

export default async function page(props: PageProps<"/lists">) {
  const { type } = await props.searchParams;

  const likeIds = await fetchCurrentUserLikeIds();
  const members = await fetchLikedMembers(type as string);

  return (
    <div className="mx-10">
      <ListTabs members={members} likeIds={likeIds} />
    </div>
  );
}
