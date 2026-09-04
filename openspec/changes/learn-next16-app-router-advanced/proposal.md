## Why

This app already exercises the basics of the Next.js 16 App Router (routing, server actions, auth via a proxy, image optimization, forms), but a large surface of the framework — especially the version-16 rendering model (Cache Components) and senior-level nuances of features already in use (server action security, revalidation mechanics, request-time APIs, error-handling model) — remains unpracticed. The goal is to close that gap deliberately: go deep enough on both new and already-touched framework features to be able to discuss trade-offs, nuances, and gotchas confidently in interviews and team grooming sessions, not just demonstrate basic usage.

This proposal captures a learning roadmap only. It does not change any product behavior in the dating-app codebase. Each roadmap item is meant to be picked up later as its own focused exploration/implementation chat, using this document as the index.

## What Changes

- Add a learning roadmap (`theory.md` + `design.md` + `tasks.md`) enumerating Next.js 16 App Router topics to practice, grouped into:
  - **Net-new framework paradigms** not yet touched in this codebase (Cache Components/`use cache`, parallel & intercepting routes, `after()`, instrumentation, optimistic UI). Testing is explicitly excluded from scope.
  - **Senior-level nuances of features already in use** in this codebase (server action security model, `revalidatePath`/`revalidateTag`/`updateTag` mechanics, `fetch` caching & memoization semantics, `cookies()`/async request APIs, the expected-vs-uncaught error model, image/metadata edge cases, and Route Handlers/the Backend-for-Frontend pattern vs. Server Actions).
  - **A lower-depth breadth pass** over topics judged lower priority (forms/redirects/prefetching, Draft Mode, CSP, Data Access Layer/DTOs, production readiness, unexplored UI primitives, scale/deployment architecture, content tooling) — read-and-note only, no mandatory build.
- `theory.md` is a standalone, implementation-free theory primer (one section per topic) to be read before any hands-on task.
- For each roadmap item: current state in this codebase, the specific doc-backed nuance/gotcha worth knowing, and a task that asks for **several candidate practice exercises** (mixing adaptations of existing app code and independent standalone mini-features — feature content is irrelevant, only the framework concept being exercised matters) rather than one prescribed exercise.
- No source code, config, or dependencies change as part of this proposal — implementation happens in follow-up changes, one per roadmap item.

## Capabilities

No product capability is introduced or modified — this change produces a planning artifact only. `skip_specs: true` is set in this change's `.openspec.yaml`.

## Impact

- Adds `openspec/changes/learn-next16-app-router-advanced/theory.md`, `design.md`, and `tasks.md` (this change).
- No runtime code, schema, or dependency changes.
- Future changes referencing this roadmap will touch: `next.config.ts`, `src/server/actions/*`, `src/app/**`, `src/proxy.ts`.
