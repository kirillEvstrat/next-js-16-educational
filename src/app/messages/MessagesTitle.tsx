"use client";

import { useSearchParams } from "next/navigation";
import React from "react";

export default function MessagesTitle() {
  const searchParams = useSearchParams();
  const container = searchParams.get("container") ?? "inbox";
  const title = container === "outbox" ? "Outbox" : "Inbox";

  return <h2 className="text-2xl font-bold capitalize text-accent">{title}</h2>;
}
