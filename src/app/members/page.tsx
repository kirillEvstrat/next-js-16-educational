import { getMembers } from "@/server/actions/members";
import MemberCard from "./MemberCard";
import { fetchCurrentUserLikeIds } from "@/server/actions/likes";
import Filters from "./Filters";
import MembersPagination from "./MembersPagination";
import { UserFilters } from "@/lib/types";
import EmptyState from "./EmptyState";

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<UserFilters>;
}) {
  const searchFilters = await searchParams;
  const { items: members, totalCount } = await getMembers(searchFilters);
  const likeIds = (await fetchCurrentUserLikeIds()) ?? [];

  return (
    <>
      {!members?.length ? (
        <EmptyState />
      ) : (
        <div className="-mt-8 flex flex-col flex-1 h-screen">
          <Filters totalCount={totalCount} />
          <div className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {members?.map((member) => (
              <MemberCard key={member.id} member={member} likeIds={likeIds} />
            ))}
          </div>
          <MembersPagination totalCount={totalCount} />
        </div>
      )}
    </>
  );
}
