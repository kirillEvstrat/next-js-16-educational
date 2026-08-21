import { getMembers } from "@/server/actions/members";
import MemberCard from "./MemberCard";
import { fetchCurrentUserLikeIds } from "@/server/actions/likes";

export default async function MembersPage() {
  const members = await getMembers();
  const likeIds = (await fetchCurrentUserLikeIds()) ?? [];

  return (
    <div>
      <div className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {members?.map((member) => (
          <MemberCard key={member.id} member={member} likeIds={likeIds} />
        ))}
      </div>
    </div>
  );
}
