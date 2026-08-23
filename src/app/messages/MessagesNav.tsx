"use client";

import { Spinner } from "@heroui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState, useTransition } from "react";
import classNames from "classnames";

type Props = {
  counts: {
    inbox: number;
    outbox: number;
  };
};

const containers = [
  { label: "Inbox", value: "inbox" as const },
  { label: "Outbox", value: "outbox" as const },
];

export default function MessagesNav({ counts }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeContainer = searchParams.get("container") ?? "inbox";
  const [isPending, startTransition] = useTransition();
  const [pendingContainer, setPendingContainer] = useState<string | null>(null);

  useEffect(() => {
    if (!isPending) {
      setPendingContainer(null);
    }
  }, [isPending]);

  const handleContainerChange = (container: string) => {
    if (container === activeContainer || isPending) return;

    setPendingContainer(container);
    startTransition(() => {
      router.replace(`${pathname}?container=${container}`);
    });
  };

  return (
    <nav className="flex flex-col gap-2 p-4">
      {containers.map((container) => {
        const isActive = activeContainer === container.value;
        const count =
          container.value === "inbox" ? counts.inbox : counts.outbox;
        const isCurrentPending =
          isPending && pendingContainer === container.value;

        return (
          <button
            key={container.value}
            type="button"
            disabled={isPending}
            onClick={() => handleContainerChange(container.value)}
            className={classNames(
              "flex items-center justify-between rounded-xl border px-3 py-2 transition",
              {
                "border-accent/30 bg-accent/10 text-accent": isActive,
                "border-default-200 text-foreground hover:border-accent/30 hover:bg-content2":
                  !isActive,
                "cursor-not-allowed opacity-75": isPending,
              },
            )}
          >
            <span className="font-medium">{container.label}</span>
            <div className="flex min-w-7 items-center justify-center">
              {isCurrentPending ? (
                <Spinner color="accent" size="sm" />
              ) : (
                <span
                  className={classNames(
                    "min-w-7 rounded-full px-2 py-0.5 text-center text-xs font-semibold",
                    {
                      "bg-accent text-white": isActive,
                      "bg-content3 text-foreground/70": !isActive,
                    },
                  )}
                >
                  {count}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </nav>
  );
}
