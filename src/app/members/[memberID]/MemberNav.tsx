"use client";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import React from "react";

export const sections = [
  { name: "Profile", path: "" },
  { name: "Photos", path: "/photos" },
  { name: "Chat", path: "/chat" },
];

export default function MemberNav({ userId }: { userId: string }) {
  const active = useSelectedLayoutSegment();
  const base = `/members/${userId}`;

  return (
    <nav className="flex flex-col ml-4 gap-2 p-4 text-2xl">
      {sections.map((section) => (
        <Link
          key={section.name}
          href={base + section.path}
          className={`block rounded ${active === section.path.slice(1) ? "text-accent" : "hover:text-accent/50"}`}
        >
          {section.name}
        </Link>
      ))}
    </nav>
  );
}
