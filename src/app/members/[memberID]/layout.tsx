import React from "react";
import { getMemberById } from "@/server/actions/members";
import { notFound } from "next/navigation";
import { buttonVariants, Card, Separator } from "@heroui/react";
import Image from "next/image";
import { calculateAge } from "@/lib/utils";
import Link from "next/link";
import MemberNav from "./MemberNav";
import SectionTitle from "./SectionTitle";
import { getCurrentUser } from "@/lib/auth";

export const sections = [
  { name: "Profile", path: "" },
  { name: "Photos", path: "/photos" },
  { name: "Chat", path: "/chat" },
];

export default async function Layout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ memberID: string }>;
}>) {
  const { memberID } = await params;
  const member = await getMemberById(memberID);
  const currentUser = await getCurrentUser();
  const isCurrentUser = currentUser?.id === memberID;

  if (!member) {
    return notFound();
  }
  return (
    <div className="grid grid-cols-12 gap-5 h-[80vh]">
      <div className="col-span-3">
        <Card className="w-full mt-10 items-center h-[80vh] ">
          <Image
            className="aspect-square object-cover relative rounded-xl"
            src={member?.image ?? "/images/user.png"}
            alt={`${member.name}'s avatar`}
            width={500}
            height={500}
            sizes="(max-width: 768px) 100vw, 33vw"
            unoptimized
            loading="eager"
          />
          <Card.Content>
            <div className="flex flex-col items-center">
              <div className="text-2xl">
                {member.name}, {calculateAge(member.dateOfBirth)}
              </div>
              <div className="text-sm text-foreground/50">
                {member.city}, {member.country}
              </div>
            </div>
            <Separator />
            <MemberNav
              userId={member.userID}
              sections={
                isCurrentUser
                  ? sections.filter((section) => section.path !== "/chat")
                  : sections
              }
            />
          </Card.Content>
          <Card.Footer className="flex w-full z-50 justify-center absolute bottom-0 bg-linear-gradient-to-t from-black/80 to-transparent p-2">
            <Link
              href={"/members"}
              className={buttonVariants({
                variant: "primary",
                className: "w-full",
              })}
            >
              Back to Members
            </Link>
          </Card.Footer>
        </Card>
      </div>
      <div className="col-span-9">
        <Card className="w-full mt-10 h-[80vh]">
          <Card.Header>
            <SectionTitle sections={sections} isOwner={isCurrentUser} />
          </Card.Header>
          <Separator />
          <Card.Content>{children}</Card.Content>
        </Card>
      </div>
    </div>
  );
}
