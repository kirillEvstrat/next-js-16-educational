import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";

export default async function MembersPage() {
  const user = await getCurrentUser();

  return (
    <div>
      <h3 className="text-2xl">header</h3>
      <Link href={"/"}>go back home</Link>
      <div>
        {user ? <pre>{JSON.stringify(user, null, 2)}</pre> : "No logged in"}
      </div>
    </div>
  );
}
