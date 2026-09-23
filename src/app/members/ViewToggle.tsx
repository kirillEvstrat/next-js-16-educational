"use client";

import { setMembersView } from "@/server/actions/preferences";

export default function ViewToggle({ current }: { current: "grid" | "list" }) {
  return (
    <div className="flex gap-3 text-sm px-10">
      <button
        type="button"
        onClick={() => setMembersView("grid")}
        className={
          current === "grid" ? "font-semibold underline" : "text-gray-500"
        }
      >
        Grid
      </button>
      <button
        type="button"
        onClick={() => setMembersView("list")}
        className={
          current === "list" ? "font-semibold underline" : "text-gray-500"
        }
      >
        List
      </button>
    </div>
  );
}
