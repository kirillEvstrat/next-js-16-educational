"use client";
import { useSelectedLayoutSegment } from "next/navigation";
import React from "react";
import { sections } from "./MemberNav";

export default function SectionTitle() {
  const active = useSelectedLayoutSegment();
  const title =
    sections.find((section) => section.path.slice(1) === active)?.name ??
    "Profile";

  return (
    <h2 className="text-2xl font-bold capitalize text-accent ">{title}</h2>
  );
}
