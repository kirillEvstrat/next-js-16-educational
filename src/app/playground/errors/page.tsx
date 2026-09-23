import { brokenRedirect, fixedRedirect, throwBug } from "./actions";

export default function ErrorsPlaygroundPage() {
  return (
    <div className="flex flex-col gap-8 max-w-xl mx-auto mt-8">
      <section>
        <h2 className="text-xl font-semibold">
          Trap: redirect() inside try/catch
        </h2>
        <p className="text-sm text-gray-600 mb-3">
          redirect() throws a special NEXT_REDIRECT error that Next&apos;s
          runtime catches to perform navigation. A try/catch around it that
          doesn&apos;t rethrow swallows that signal -- the redirect quietly does
          nothing.
        </p>
        <div className="flex gap-3">
          <form action={brokenRedirect}>
            <button className="border px-3 py-1 rounded">
              Broken (stays here)
            </button>
          </form>
          <form action={fixedRedirect}>
            <button className="border px-3 py-1 rounded">
              Fixed with unstable_rethrow (navigates)
            </button>
          </form>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Uncaught bug → error.tsx</h2>
        <p className="text-sm text-gray-600 mb-3">
          This throws for real, uncaught. It should bubble to the nearest
          error.tsx, whose &quot;Try again&quot; button re-renders this segment
          via unstable_retry().
        </p>
        <form action={throwBug}>
          <button className="border px-3 py-1 rounded">
            Trigger uncaught error
          </button>
        </form>
      </section>
    </div>
  );
}
