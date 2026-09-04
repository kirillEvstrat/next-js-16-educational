# Theory Primer — Next.js 16 App Router Topics

Read the relevant section below (and its cited doc source) before starting the matching task group in [tasks.md](./tasks.md). Each section is theory only — no implementation. See [design.md](./design.md) for how each topic maps to this codebase, and [tasks.md](./tasks.md) for the practice exercises. Testing is intentionally excluded from this roadmap.

---

## §A1 — Cache Components (`use cache`, `cacheLife`, `cacheTag`, `updateTag`)

Source: `01-getting-started/08-caching.md`, `02-guides/migrating-to-cache-components.md`

Cache Components is Next 16's rendering model, enabled via the `cacheComponents` flag. Instead of choosing "static" or "dynamic" for a whole route (the old `dynamic`/`revalidate`/`fetchCache` segment configs), you mark individual **functions or components** as cacheable with the `'use cache'` directive. A cached function's output is stored keyed by its inputs; `cacheLife(profile)` sets how long the cache entry is considered fresh (`'seconds' | 'minutes' | 'hours' | 'days' | 'max'` or a custom profile); `cacheTag(name)` attaches an invalidation label to it. Everything _not_ marked `'use cache'` is dynamic by default and must either be genuinely request-time (wrapped in `<Suspense>`) or itself cached. With the flag on, Next.js surfaces any uncached/runtime data access as a **build or dev-time error**, naming exactly what needs `'use cache'` or a `<Suspense>` boundary — the framework forces you to be explicit rather than silently picking a default.

## §A2 — Rendering Philosophy / Partial Prerendering (PPR)

Source: `02-guides/rendering-philosophy.md`

Most frameworks draw the static/dynamic line at the **route** level: a page is either fully prerendered or fully server-rendered per request. Next.js draws it at the **component** level: a single response can contain a static shell (rendered once, served instantly) with dynamic or cached "holes" that stream in as they resolve, all in one HTTP response. This requires the server to support **streaming** (content arrives progressively, not as one buffered blob) and requires cache coordination when running multiple instances, because any cached fragment can be invalidated on demand independent of the rest of the page. The trade-off: finer-grained rendering flexibility for application code, in exchange for more infrastructure complexity on the hosting side (the reason Vercel/adapters need explicit PPR support).

## §A3 — Parallel Routes & Intercepting Routes

Source: `03-api-reference/03-file-conventions/parallel-routes.md`, `intercepting-routes.md`

**Parallel routes** (`@slotName` folders) let a layout render more than one independent page-like subtree simultaneously — each slot has its own loading/error state and navigates independently. **Intercepting routes** (`(.)folder`, `(..)folder`, `(...)folder` conventions, matching sibling/parent/root levels) let a route render a _different_ component when reached via **client-side navigation** from within the app than when reached via a **direct URL/hard reload**. Combined, these two features are the standard way to build a modal that: has its own shareable URL, preserves the underlying page when opened via in-app navigation, but renders as a full standalone page on refresh or direct link. A `default.tsx` (or a catch-all returning `null`) in a slot is required to define what renders when no matching sub-route is active for that slot.

## §A4 — `after()`

Source: `03-api-reference/04-functions/after.md`

`after(callback)` schedules work to run **after** the response (or the current render/action) has been sent to the client, without delaying it. It's for side effects that don't affect what the user sees: logging, analytics, sending a notification, writing an audit record. Unlike an unawaited promise (which can be killed when the serverless function/runtime shuts down after the response), `after()` is guaranteed by the runtime to be allowed to finish. It runs in the same request context, so it still has access to `cookies()`/`headers()` (read-only) but must not attempt to affect the already-sent response.

## §A5 — Instrumentation / OpenTelemetry

Source: `02-guides/instrumentation.md`, `02-guides/open-telemetry.md`

`instrumentation.ts` at the project root exports a `register()` function that runs once when the server process starts (before any request), the natural place to initialize monitoring/tracing SDKs, set up OpenTelemetry exporters, or run startup checks. Next.js has built-in OpenTelemetry support: spans are automatically created for key operations (route handlers, `fetch` calls, etc.) once a tracer/provider is registered in `instrumentation.ts`. The concept to internalize is _process lifecycle_ (register once, globally) vs. _request lifecycle_ (`after()`, middleware/proxy) — instrumentation is the former.

## §A7 — `useOptimistic` / Instant Navigation / `useLinkStatus`

Source: `02-guides/instant-navigation.md`, `04-functions/use-link-status.md`

`useOptimistic(state, updateFn)` (a React hook, not Next-specific) lets you render a _predicted_ next state immediately when a Server Action is dispatched, then reconciles with the real result once the action resolves — critically, if the action throws, React automatically rolls the optimistic state back. This differs from manually tracking "pending" local state because the rollback and reconciliation are handled by the framework's action-transition machinery, not hand-written. "Instant navigation" refers to Next's link prefetching + streaming making a click feel synchronous even though a server round-trip happens; `useLinkStatus` exposes the pending state of a specific `<Link>` for building fine-grained loading indicators (e.g. a spinner only on the clicked link, not the whole page).

## §B1 — Server Action Security Model

Source: `02-guides/server-actions.md` (Security section)

A Server Action compiles to a POST endpoint reachable by anyone who can construct the same request — the `'use server'` directive hides the implementation from the client bundle, not the endpoint itself. Next.js provides framework-level protections: an **Origin vs. Host CSRF check** (rejects cross-origin POSTs), a **1MB default body size limit**, **encrypted action IDs** with dead-code elimination (unused actions aren't reachable at all), and **closure variable encryption** (values captured from the surrounding scope are encrypted before being sent to the client and back). None of these substitute for **application-level** authorization: every action must re-authenticate the session, and re-derive _which row_ and _what state_ from the trusted session/DB rather than trusting client-supplied IDs or booleans for anything security-sensitive. A client may legitimately say "act on item X"; it must not be trusted to say "and item X's current state is Y." Separately, Next's client dispatcher runs actions from one client **sequentially**, not in parallel — `Promise.all` over multiple actions doesn't get you concurrency the way it would over plain fetches.

## §B2 — Expected vs. Uncaught Errors

Source: `01-getting-started/10-error-handling.md`

Next.js's error model distinguishes two categories. **Expected errors** (validation failures, "not found", business-rule rejections) are _not_ thrown — they're returned as normal values from a Server Action (paired with `useActionState` on the client to render them) so the UI can show them inline. **Uncaught exceptions** (genuine bugs, unexpected failures) should be allowed to propagate and are caught by the nearest `error.tsx` boundary, which Next renders automatically. Wrapping everything in `try/catch` and logging-then-swallowing conflates the two: real bugs disappear silently instead of surfacing to an error boundary (or monitoring). A specific trap: `redirect()` (and `notFound()`) work by **throwing** a special control-flow value that Next's routing layer catches — if your own `try/catch` around the call doesn't specifically re-throw framework control-flow errors, you silently break the redirect.

## §B3 — `revalidatePath` Mechanics

Source: `03-api-reference/04-functions/revalidatePath.md`, `02-guides/how-revalidation-works.md`

`revalidatePath` doesn't invalidate "a URL" directly — internally, every route gets automatic **soft tags** (prefixed `_N_T_`) per path segment (e.g. `_N_T_/blog/layout`, `_N_T_/blog/hello`), and `revalidatePath` invalidates the soft tag(s) matching the given path, which is why invalidating a layout path cascades to every nested page. For a literal path (`/product/123`) no `type` is needed; for a pattern with a dynamic segment (`/product/[slug]`) you must pass `type: 'page' | 'layout'` since the path isn't a real file route. A currently-documented quirk: calling it inside a Server Function also causes all previously-visited pages to be refreshed on next navigation — this is a known, temporary framework behavior, not a bug in your code.

## §B4 — Choosing Between `revalidatePath` / `revalidateTag` / `updateTag` / `refresh()`

Source: `02-guides/server-actions.md` ("Choosing a cache update"), `04-functions/revalidateTag.md`, `04-functions/updateTag.md`

These four APIs give different consistency guarantees after a mutation: **`updateTag`** expires a tag immediately and forces the current action's own response to wait for fresh data — use it when the user must see their own write instantly ("read-your-own-writes"). **`revalidateTag`** marks a tag stale-while-revalidate — the current response does _not_ wait, subsequent requests get the stale value while a background refetch happens. **`revalidatePath`** invalidates by URL/route path rather than by tag — simpler when only one route is affected and tagging feels like overkill. **`refresh()`** re-renders the current route's RSC payload without invalidating any cache — for when the visible state changed for a reason _outside_ the cache (e.g., a cookie). Picking the wrong one doesn't error — it silently changes whether the user's own action feels instant or eventually-consistent.

## §B5 — `fetch()` Caching & Request Memoization

Source: `03-api-reference/04-functions/fetch.md`

Next.js extends the Web `fetch` API with a `cache` option (`'force-cache'` looks for a persistent server-side cache match; `'no-store'` always goes to the network; the default `auto no cache` fetches fresh in dev but is prerendered once at build time in the absence of request-time APIs) and a `next: { revalidate, tags }` option for time-based/tag-based invalidation. Two independent mechanisms are easy to conflate: (1) **caching** (persists across requests/deployments, controlled by `cache`/`next.revalidate`) vs. (2) **memoization** (dedupes identical `GET` fetches _within a single render pass_, always on, opt out via an `AbortController` signal) — memoization does not apply inside Route Handlers since they aren't part of the React component tree. A subtle rule: if the same URL is fetched twice in one route with two different `revalidate` values, **the lower value wins** for the whole route.

## §B6 — `cookies()` / Async Request-Time APIs

Source: `04-functions/cookies.md`

`cookies()` is an async function (legacy sync access still works but is deprecated). It is **read-only in Server Components** — you're reading what the browser already sent in request headers — and **read/write only in Server Functions or Route Handlers**, because setting a cookie means emitting a `Set-Cookie` response header, and HTTP does not allow adding headers after a streamed response has already started. This is the underlying _reason_ for the read/write split, not an arbitrary framework rule. A nice consequence: mutating a cookie inside a Server Action automatically triggers a re-render of the current route in the same response, exactly like calling `updateTag` or `redirect` does.

## §B7 — Images (`next/image`)

Source: `01-getting-started/12-images.md`

`next/image` optimizes, resizes, and lazy-loads images, but two flags materially change behavior: `priority` (opts an image out of lazy-loading and hints it should be prioritized for LCP — meant for above-the-fold hero images, not every image) and `sizes` (tells the browser which of the generated responsive variants to actually request; without it, the browser may over-fetch a larger variant than needed). Security-wise, `remotePatterns` acts as an **allowlist** for which external hosts the image optimizer will fetch from and proxy — an unbounded/wildcard pattern effectively turns your image endpoint into an open proxy (SSRF-adjacent risk), which is why the pattern list should be as narrow as the app actually needs.

## §B8 — Metadata (`generateMetadata`)

Source: `03-api-reference/04-functions/generate-metadata.md`

A static `metadata` export is just an object, resolved instantly. `generateMetadata` is an async function, which means Next.js must **await it before it can start streaming the page shell** — if it does an uncached, slow data fetch, it directly delays Time To First Byte, undermining the whole "static shell streams instantly" model from §A2. The fix is the same one that applies everywhere else in this rendering model: cache the data the metadata function needs (`'use cache'` or a cached fetch) so the metadata resolves fast even though it's computed per-request.

## §B9 — `proxy.ts` (renamed Middleware) & Edge Runtime Constraints

Source: `03-api-reference/03-file-conventions/proxy.md`

`proxy.ts` (the App Router's renamed middleware convention) runs on every matched request **before** routing resolves to a page/layout/action — in the Edge runtime, not the Node.js runtime the rest of your app uses. That means: no arbitrary Node APIs, and none of `revalidatePath`/`revalidateTag`/`updateTag`/`cookies().set()`-for-app-data are available there — those APIs are tied to the Node request-time cache and RSC render pipeline, which doesn't exist yet at the point proxy runs. `proxy.ts` can read cookies/headers and redirect/rewrite, but any actual data mutation or cache invalidation has to happen further downstream, in a Server Action or Route Handler.

## §B10 — Route Handlers & the Backend-for-Frontend Pattern

Source: `02-guides/backend-for-frontend.md`, `03-file-conventions/route.md`, `01-getting-started/07-mutating-data.md`

A Route Handler (`app/**/route.ts`, exporting `GET`/`POST`/etc.) is a **public HTTP endpoint**: any client can call it, with any HTTP verb, and it can return any content type (JSON, XML, images, plain text) — this is Next's "Backend for Frontend" pattern, not a full backend replacement. It differs from a Server Action along exactly the axes covered in the Route Handlers vs. Server Actions discussion: a Route Handler has a stable, addressable URL usable by clients outside your own React tree (mobile apps, webhooks, third-party widgets, `curl`), doesn't automatically re-render any UI, and isn't restricted to `POST`. A Server Action is reachable via POST too, but only through React's action mechanism, and its payoff is the single-round-trip "mutate + re-render current route" behavior — it has no stable public contract and isn't meant to be called by anything outside the app. Both share the same security posture: neither is protected by the UI that calls it, so authentication/authorization must happen **inside** the handler/action itself, not just by hiding the button. File conventions build on Route Handlers implicitly (`sitemap.xml`, `robots.txt`, `opengraph-image`, `manifest.json`), and custom ones (`rss.xml`, `llms.txt`) follow the same pattern. Content negotiation (serving different content types from the same URL based on the `Accept` header) is done via `rewrites` with header matching, not inside the handler itself.

---

## Track C — Breadth Topics (condensed reference)

These are lower-depth by design: read the source, take a short note, and only build something if it's genuinely useful. No dedicated theory section per topic — the doc source is the primary reference.

- **Forms, redirects & prefetching** (`02-guides/forms.md`, `redirecting.md`, `prefetching.md`): native `<form>` + Server Action patterns beyond what react-hook-form gives you; `redirect()` vs `permanentRedirect()` semantics; how `<Link>` prefetching interacts with caching.
- **Draft Mode & Content Security Policy** (`02-guides/draft-mode.md`, `content-security-policy.md`): previewing unpublished/unapproved content (relevant to the photo-approval flow) via a bypass cookie; CSP nonces with Server Components.
- **Data Access Layer & DTOs** (`02-guides/data-security.md` — Data Access Layer section): centralizing data fetching behind server-only functions that return sanitized DTOs instead of raw Prisma models directly to components — a real gap in this codebase's `server/actions/*.ts`, which return full `Member`/`User` rows.
- **Production readiness** (`02-guides/environment-variables.md`, `production-checklist.md`, `self-hosting.md`): env var loading/exposure rules (`NEXT_PUBLIC_*`), the pre-launch checklist, self-hosting requirements for streaming/ISR.
- **UI primitives not yet used** (`03-api-reference/02-components/*` — `next/font`, `next/script`, `next/form`; `04-functions/use-router.md`, `use-search-params.md`, `generate-static-params.md`): font optimization, third-party script loading strategies, the `next/form` component, and `generateStaticParams` for dynamic route pre-rendering.
- **Scale & deployment architecture** (`02-guides/multi-tenant.md`, `multi-zones.md`, `package-bundling.md`, `03-api-reference/07-adapters/*`, `07-edge.md`, `08-turbopack.md`): multi-tenant routing strategies, splitting one app into multiple deployable zones, adapter/edge-runtime constraints, Turbopack internals.
- **Content tooling** (`02-guides/mdx.md`, `sass.md`, `css-in-js.md`, `scripts.md`, `videos.md`): lowest priority of all — only relevant if a future exercise needs MDX content, Sass, or third-party script/video embeds.
