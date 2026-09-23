import { getMembers } from "@/server/actions/members";
import MemberCard from "./MemberCard";
import { fetchCurrentUserLikeIds } from "@/server/actions/likes";
import Filters from "./Filters";
import MembersPagination from "./MembersPagination";
import { UserFilters } from "@/lib/types";
import EmptyState from "./EmptyState";
import ViewToggle from "./ViewToggle";
import React, { Suspense } from "react";
import { cookies } from "next/headers";

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<UserFilters>;
}) {
  const searchFilters = await searchParams;
  const { items: members, totalCount } = await getMembers(searchFilters);
  const likeIds = (await fetchCurrentUserLikeIds()) ?? [];
  const cookieStore = await cookies();
  const view =
    cookieStore.get("membersView")?.value === "list" ? "list" : "grid";

  return (
    <Suspense fallback={null}>
      {!members?.length ? (
        <EmptyState />
      ) : (
        <div className="-mt-8 flex flex-col flex-1 h-screen">
          <Filters totalCount={totalCount} />
          <ViewToggle current={view} />
          <div
            className={
              view === "grid"
                ? "p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                : "p-10 flex flex-col gap-4"
            }
          >
            {members?.map((member) => (
              <MemberCard key={member.id} member={member} likeIds={likeIds} />
            ))}
          </div>
          <MembersPagination totalCount={totalCount} />
        </div>
      )}
    </Suspense>
  );
}
