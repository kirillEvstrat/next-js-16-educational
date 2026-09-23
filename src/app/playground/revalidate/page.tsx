import { Suspense } from "react";
import Link from "next/link";
import {
  doRefresh,
  doRevalidatePath,
  doRevalidateTag,
  doUpdateTag,
} from "./actions";
import { Panel, TaggedPanel, UncachedPanel, UntaggedPanel } from "./panels";

function Action({
  action,
  label,
}: {
  action: () => Promise<void>;
  label: string;
}) {
  return (
    <form action={action}>
      <button
        type="submit"
        className="rounded bg-gray-800 px-3 py-1 text-sm text-white"
      >
        {label}
      </button>
    </form>
  );
}

export default function RevalidatePlaygroundPage() {
  return (
    <section className="flex flex-col gap-4 p-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-xl font-bold">Invalidation scope playground</h1>
        <p className="text-sm text-gray-600">
          Panels A and B are shared with{" "}
          <Link className="underline" href="/playground/revalidate/other">
            /other
          </Link>
          , which has no buttons. Compare both pages after each action.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        <Action action={doUpdateTag} label="updateTag('demo-tag')" />
        <Action
          action={doRevalidateTag}
          label="revalidateTag('demo-tag','max')"
        />
        <Action
          action={doRevalidatePath}
          label="revalidatePath('/playground/revalidate')"
        />
        <Action action={doRefresh} label="refresh()" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <TaggedPanel />
        <UntaggedPanel />
        <Suspense
          fallback={<Panel title="C — uncached" note="streaming…" value="--" />}
        >
          <UncachedPanel />
        </Suspense>
      </div>
    </section>
  );
}
