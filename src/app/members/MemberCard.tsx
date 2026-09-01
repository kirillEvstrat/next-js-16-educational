import Link from "next/link";
import React from "react";
import Image from "next/image";
import { Member } from "../../../generated/prisma/browser";
import { Card, CardFooter } from "@heroui/react";
import { calculateAge } from "@/lib/utils";
import LikeButton from "@/components/LikeButton";
import PresenceDot from "@/components/PresenceDot";

type Props = {
  member: Member;
  likeIds: string[];
};

export default function MemberCard({ member, likeIds }: Props) {
  const imageSrc = member?.image ?? "/images/user.png";
  const hasLiked = likeIds.includes(member.userID);

  return (
    <Link href={`/members/${member.userID}`}>
      <Card className="transition-all duration-300 hover:scale-105 hover:shadow-xl">
        <Image
          className="aspect-square object-cover relative"
          src={imageSrc}
          alt={`${member.name}'s avatar`}
          width={500}
          height={500}
          sizes="(max-width: 768px) 100vw, 33vw"
          unoptimized
          loading="eager"
        />
        <div className="absolute top-3 right-3 z-50">
          <LikeButton targetUserId={member.userID} hasLiked={hasLiked} />
        </div>
        <div className="absolute top-2 left-3 z-50">
          <PresenceDot member={member} />
        </div>
        <CardFooter className="flex w-full z-50 justify-start absolute bottom-0 bg-linear-gradient-to-t from-black/80 to-transparent p-2">
          <div className="flex flex-col text-white p-2">
            <h3 className="font-semibold">
              {member.name}, {calculateAge(member.dateOfBirth)}
            </h3>
            <p className="text-sm">{member.city}</p>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
