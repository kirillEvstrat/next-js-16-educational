import { getMembers } from "@/server/actions/members";
import MemberCard from "./MemberCard";

export default async function MembersPage() {
  const members = await getMembers();

  return (
    <div>
      <div className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {members?.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}
