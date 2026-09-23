import { cookies } from "next/headers";
import ThemeToggle from "./ThemeToggle";

export default async function CookiesPlaygroundPage() {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value ?? "light";

  return (
    <div
      className={`min-h-[50vh] p-8 rounded max-w-xl mx-auto mt-8 ${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-white text-black border"
      }`}
    >
      <h2 className="text-xl font-semibold mb-2">
        Cookie read/write boundary demo
      </h2>
      <p className="text-sm mb-4">
        This Server Component reads the &quot;theme&quot; cookie during its own
        render -- read-only here. The buttons call a Server Action, the only
        place allowed to write it, because writing means a Set-Cookie header and
        this component may already be mid-stream by the time you click.
      </p>
      <ThemeToggle current={theme} />
    </div>
  );
}
