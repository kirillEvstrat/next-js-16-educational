"use client";
import { useSelectedLayoutSegment } from "next/navigation";
import React from "react";
import PhotoUpload from "./photos/PhotoUpload";

type Props = {
  sections: { name: string; path: string }[];
  isOwner: boolean;
};

export default function SectionTitle({ sections, isOwner }: Props) {
  const active = useSelectedLayoutSegment();
  const title =
    sections.find((section) => section.path.slice(1) === active)?.name ??
    "Profile";

  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold capitalize text-accent ">{title}</h2>
      {title === "Photos" && isOwner && <PhotoUpload />}
    </div>
  );
}
