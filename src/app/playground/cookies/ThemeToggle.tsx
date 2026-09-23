"use client";

import { setTheme } from "./actions";

export default function ThemeToggle({ current }: { current: string }) {
  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={current === "light" ? "font-semibold underline" : ""}
      >
        Light
      </button>
      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={current === "dark" ? "font-semibold underline" : ""}
      >
        Dark
      </button>
    </div>
  );
}
