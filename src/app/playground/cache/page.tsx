import { Suspense } from "react";
import { cacheLife, cacheTag } from "next/cache";
import { connection } from "next/server";
import { expireRevalidateTagPanel, expireUpdateTagPanel } from "./actions";

function now() {
  return new Date().toISOString().slice(11, 23);
}

function Panel({
  title,
  note,
  value,
  children,
}: {
  title: string;
  note: string;
  value: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded border border-gray-300 bg-white p-4 flex flex-col gap-2">
      <h2 className="font-semibold">{title}</h2>
      <p className="text-xs text-gray-600">{note}</p>
      <code className="text-2xl tabular-nums">{value}</code>
      {children}
    </div>
  );
}

function Button({ label }: { label: string }) {
  return (
    <button
      type="submit"
      className="self-start rounded bg-gray-800 px-3 py-1 text-sm text-white"
    >
      {label}
    </button>
  );
}

// Cached, but expire=1min is too short to be baked into the static shell, so it needs a boundary.
async function ShortLivedPanel() {
  "use cache";
  cacheLife("minutes");

  return (
    <Panel
      title="1 — cached, short-lived"
      note="cacheLife('seconds') → expire 1min. Cached, yet NOT shell-eligible: without the <Suspense> around it, the route errors."
      value={now()}
    />
  );
}

async function UpdateTagPanel() {
  "use cache";
  cacheLife("max");
  cacheTag("panel-update");

  return (
    <Panel
      title="2 — updateTag"
      note="cacheLife('max') so only the tag can change it. The click's own response already carries the new value."
      value={now()}
    >
      <form action={expireUpdateTagPanel}>
        <Button label="updateTag('panel-update')" />
      </form>
    </Panel>
  );
}

async function RevalidateTagPanel() {
  "use cache";
  cacheLife("max");
  cacheTag("panel-revalidate");

  return (
    <Panel
      title="3 — revalidateTag(tag, 'max')"
      note="Same setup as panel 2. The click's response still shows the OLD value; reload to see the refreshed one."
      value={now()}
    >
      <form action={expireRevalidateTagPanel}>
        <Button label="revalidateTag('panel-revalidate','max')" />
      </form>
    </Panel>
  );
}

async function LivePanel() {
  await connection();
  await new Promise((resolve) => setTimeout(resolve, 1200));

  return (
    <Panel
      title="4 — uncached"
      note="connection() defers to request time; the 1.2s delay makes the streamed hole visible against the shell."
      value={now()}
    />
  );
}

function Skeleton({ title }: { title: string }) {
  return <Panel title={title} note="streaming…" value="--:--:--.---" />;
}

export default function CachePlaygroundPage() {
  return (
    <section className="flex flex-col gap-4 p-6">
      <header>
        <h1 className="text-xl font-bold">Cache Components playground</h1>
        <p className="text-sm text-gray-600">
          Panels 2–3 ship inside the static shell. Panels 1 and 4 stream, for
          two different reasons.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <Suspense fallback={<Skeleton title="1 — cached, short-lived" />}>
          <ShortLivedPanel />
        </Suspense>
        <UpdateTagPanel />
        <RevalidateTagPanel />
        <Suspense fallback={<Skeleton title="4 — uncached" />}>
          <LivePanel />
        </Suspense>
      </div>
    </section>
  );
}
