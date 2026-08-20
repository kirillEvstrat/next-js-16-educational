import { Spinner } from "@heroui/react";
import React from "react";

export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center h-full gap-2">
      <Spinner className="size-10 text-accent" />
      <span>Loading...</span>
    </div>
  );
}
