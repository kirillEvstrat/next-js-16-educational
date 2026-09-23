import { cacheLife, cacheTag } from "next/cache";
import { connection } from "next/server";

function now() {
  return new Date().toISOString().slice(11, 23);
}

export function Panel({
  title,
  note,
  value,
}: {
  title: string;
  note: string;
  value: string;
}) {
  return (
    <div className="rounded border border-gray-300 bg-white p-4 flex flex-col gap-1">
      <h2 className="font-semibold">{title}</h2>
      <p className="text-xs text-gray-600">{note}</p>
      <code className="text-2xl tabular-nums">{value}</code>
    </div>
  );
}

export async function TaggedPanel() {
  "use cache";
  cacheLife("max");
  cacheTag("demo-tag");

  return (
    <Panel
      title="A — cached + cacheTag('demo-tag')"
      note="Same component instance is rendered on both routes."
      value={now()}
    />
  );
}

export async function UntaggedPanel() {
  "use cache";
  cacheLife("max");

  return (
    <Panel
      title="B — cached, no tag"
      note="Only reachable via the route's implicit _N_T_ soft tags."
      value={now()}
    />
  );
}

export async function UncachedPanel() {
  await connection();

  return (
    <Panel
      title="C — uncached"
      note="Re-executes on every server render, whatever caused it."
      value={now()}
    />
  );
}
