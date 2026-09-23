import { Suspense } from "react";
import Link from "next/link";
import { Panel, TaggedPanel, UncachedPanel, UntaggedPanel } from "../panels";

export default function OtherRoutePage() {
  return (
    <section className="flex flex-col gap-4 p-6">
      <header>
        <h1 className="text-xl font-bold">/playground/revalidate/other</h1>
        <p className="text-sm text-gray-600">
          No buttons here.{" "}
          <Link className="underline" href="/playground/revalidate">
            Back
          </Link>
        </p>
      </header>

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
