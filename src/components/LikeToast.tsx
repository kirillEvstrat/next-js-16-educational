import { toast } from "@heroui/react";
import Link from "next/link";
import Image from "next/image";
import { User } from "../../generated/prisma/browser";

export default function likeToast(user: User) {
  return toast(
    <Link
      href={`/members/${user.id}`}
      className="font-semibold hover:underline"
    >
      {user.name} has liked you!
    </Link>,
    {
      indicator: (
        <Image
          src={user.image || "/images/user.png"}
          alt={user.name}
          width={40}
          height={40}
        />
      ),
      description: (
        <Link
          href={`/members/${user.id}`}
          className="font-semibold hover:underline"
        >
          click to view
        </Link>
      ),
      timeout: 5000,
    },
  );
}
