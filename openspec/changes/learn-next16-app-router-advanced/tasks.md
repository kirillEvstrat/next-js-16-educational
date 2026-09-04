Read [theory.md](./theory.md) before starting any group below -- it holds the implementation-free conceptual explanation each group's "Theory" task references. Every group's "Ideate" task must produce **at least 3 candidate exercises**, mixing (a) adaptations of existing code in this repo and (b) independent standalone mini-features built purely to exercise the concept -- feature content/business value is irrelevant, only the framework concept matters. "Build" tasks happen in their own dedicated follow-up chat, one (or more) chosen option at a time.

## 1. Foundations: Cache Components & Rendering Model (A1, A2)

- [ ] 1.1 Theory: read theory.md Section A1-A2 + `01-getting-started/08-caching.md`, `02-guides/migrating-to-cache-components.md`, `02-guides/rendering-philosophy.md`; verify by writing a 1-paragraph explanation of "static/dynamic as a spectrum" in your own words.
- [ ] 1.2 Enable `cacheComponents: true` in `next.config.ts` on a throwaway branch and observe the dev-time errors Next.js raises for uncached/runtime data access on `/members`; verify by pasting the exact error output.
- [ ] 1.3 Ideate: propose at least 3 candidate exercises for `'use cache'`/`cacheLife`/`cacheTag`/`updateTag` -- at least one converting an existing read (e.g. `getMembers`/`getMemberById` in [members.ts](src/server/actions/members.ts)) and at least one standalone playground feature (any cached widget unrelated to the dating-app domain) that exercises granular caching + on-demand tag invalidation; verify with a short written list, one line of trade-offs per option.
- [ ] 1.4 Build (separate chat): implement the chosen option(s) from 1.3; verify read-your-own-writes via `updateTag` and confirm untouched tags keep serving cached data unchanged.

## 2. Caching & Revalidation Nuances (B3, B4, B5)

- [ ] 2.1 Theory: read theory.md Section B3-B5 + `revalidatePath.md`, `revalidateTag.md`, `updateTag.md`, `fetch.md`, `how-revalidation-works.md`; verify by producing a comparison table (consistency guarantee, blocks current response?, scope) for the four invalidation APIs.
- [ ] 2.2 Ideate: propose at least 3 candidates for practicing tag-based vs. path-based invalidation -- at least one replacing an existing `revalidatePath` call (e.g. in [likes.ts](src/server/actions/likes.ts)) and at least one standalone feature that visibly demonstrates stale-while-revalidate vs. immediate expiry side by side; verify with a short list including trade-offs.
- [ ] 2.3 Build (separate chat): implement the chosen option(s); verify via network/dev logs that the expected consistency behavior occurs (e.g. the documented "lowest `revalidate` value wins" rule when the same URL is fetched twice with different values in one route).

## 3. Server Action Security Model (B1)

- [ ] 3.1 Theory: read theory.md Section B1 + `02-guides/server-actions.md` (Security section), `02-guides/data-security.md` (mutating-data section); verify by listing the framework-level protections (CSRF origin check, body size limit, closure encryption) vs. what the app must still do itself.
- [ ] 3.2 Ideate: propose at least 3 candidate mutations to harden or design -- at least one existing action (e.g. `toggleLikeMember` in [likes.ts](src/server/actions/likes.ts), which currently trusts a client-supplied `isLiked` boolean) and at least one standalone action built specifically to demonstrate an ownership-bypass vulnerability and its fix; verify with a short writeup of the exploit + fix for each candidate.
- [ ] 3.3 Build (separate chat): implement the chosen fix(es); verify with a manual test (e.g. rapid double-click, or a forged request with someone else's row id) proving the vulnerability is closed.

## 4. Expected vs. Uncaught Error Model (B2)

- [ ] 4.1 Theory: read theory.md Section B2 + `01-getting-started/10-error-handling.md`, `04-functions/catchError.md`; verify by writing down the throw-vs-return rule and explaining the `redirect()`-inside-`try/catch` trap.
- [ ] 4.2 Ideate: propose at least 3 candidates for applying `useActionState`/expected-error modeling -- at least one existing form (e.g. `updateProfile` in [members.ts](src/server/actions/members.ts)) and at least one standalone action built purely to demonstrate the `redirect()`/`try-catch` trap (trigger it broken, then fix it); verify with a short list.
- [ ] 4.3 Build (separate chat): implement the chosen option(s); verify the UI shows field-level errors without a full reload, and the deliberately-broken redirect/try-catch case is demonstrated and then fixed.

## 5. Request-Time APIs: Cookies & Proxy Nuances (B6, B9)

- [ ] 5.1 Theory: read theory.md Section B6, Section B9 + `04-functions/cookies.md`, `03-file-conventions/proxy.md`; verify by explaining why `cookies().set()` only works in Server Functions/Route Handlers and why `src/proxy.ts` cannot call it.
- [ ] 5.2 Ideate: propose at least 3 small cookie-driven features exercising the read-in-component/write-in-action boundary -- at least one adapting an existing view (e.g. a grid/list toggle on `/members`) and at least one standalone demo (e.g. a visit counter, a theme switch); verify with a short list.
- [ ] 5.3 Build (separate chat): implement the chosen option(s); verify a single round trip (network tab) shows the action's response carrying both the cookie write and the re-rendered UI.

## 6. Advanced Routing: Parallel & Intercepting Routes (A3)

- [ ] 6.1 Theory: read theory.md Section A3 + `03-file-conventions/parallel-routes.md`, `intercepting-routes.md`; verify by sketching the `@slot`/`(.)folder` structure for a chosen use case.
- [ ] 6.2 Ideate: propose at least 3 modal/slot candidates -- at least one adapting an existing view (e.g. photo detail from the member card grid, admin photo review) and at least one standalone playground route (any shareable-URL modal, content is irrelevant); verify with a short list plus a folder-structure sketch per option.
- [ ] 6.3 Build (separate chat): implement the chosen modal; verify it opens via client navigation, is shareable via a direct URL, and closes correctly on back-navigation.

## 7. UX Nuances: Optimistic UI & Instant Navigation (A7)

- [ ] 7.1 Theory: read theory.md Section A7 + `02-guides/instant-navigation.md`, `04-functions/use-link-status.md`; verify by explaining the mental-model difference between `useOptimistic` and hand-rolled pending state.
- [ ] 7.2 Ideate: propose at least 3 `useOptimistic`/instant-navigation candidates -- at least one existing interaction (e.g. [LikeButton.tsx](src/components/LikeButton.tsx), message send) and at least one standalone toy (e.g. an optimistic counter/list); verify with a short list including the rollback-on-error behavior expected for each.
- [ ] 7.3 Build (separate chat): implement the chosen option(s); verify via throttled network that the UI updates instantly and correctly rolls back on a simulated failure.

## 8. Images & Metadata Edge Cases (B7, B8)

- [ ] 8.1 Theory: read theory.md Section B7-B8 + `01-getting-started/12-images.md`, `03-api-reference/04-functions/generate-metadata.md`; verify by listing `priority`/`sizes` trade-offs and the streaming-blocking risk of a slow `generateMetadata`.
- [ ] 8.2 Ideate: propose at least 3 candidates -- at least one existing page (e.g. `/members/[memberID]` gaining `generateMetadata`/dynamic OG image) and at least one standalone image-heavy playground page to test `priority`/`sizes`/blur trade-offs; verify with a short list.
- [ ] 8.3 Build (separate chat): implement the chosen option(s); verify the page shell still streams without blocking (compare TTFB before/after) and that OG/meta tags render correctly (view-source or a social-card debugger).

## 9. Observability: `after()` & Instrumentation (A4, A5)

- [ ] 9.1 Theory: read theory.md Section A4-A5 + `04-functions/after.md`, `02-guides/instrumentation.md`; verify by explaining the difference between `after()` and awaiting inline.
- [ ] 9.2 Ideate: propose at least 3 candidates -- at least one existing mutation (e.g. logging a like/message event from [likes.ts](src/server/actions/likes.ts)/[messages.ts](src/server/actions/messages.ts)) and at least one standalone action built purely to demonstrate `after()` timing; verify with a short list.
- [ ] 9.3 Build (separate chat): implement the chosen option(s); verify the action's response time is unaffected by an artificial delay placed inside the `after()` callback.

## 10. Route Handlers & Backend for Frontend (B10)

- [ ] 10.1 Theory: read theory.md Section B10 + `02-guides/backend-for-frontend.md`, `03-file-conventions/route.md`, `01-getting-started/07-mutating-data.md`; verify by writing a short table contrasting Route Handlers vs. Server Actions (caller, HTTP verbs, content type, auto re-render, public contract).
- [ ] 10.2 Audit why each existing Route Handler in [src/app/api](src/app/api) (`auth`, `pusher-auth`, `sign-image`) has to be a Route Handler rather than a Server Action; verify with a one-line justification per endpoint.
- [ ] 10.3 Ideate: propose at least 3 candidate Route Handlers to build -- at least one that adapts existing data (e.g. a public JSON endpoint or an `rss.xml`/custom file-convention route reading from Prisma) and at least one standalone endpoint exercising a concept not in this app yet (custom content-type response, content negotiation via `rewrites` + `Accept` header, or a webhook-style `POST` receiver); verify with a short list, one line of trade-offs per option.
- [ ] 10.4 Build (separate chat): implement the chosen option(s); verify the endpoint is reachable directly (e.g. via `curl`/browser, not just through the app's UI), returns the intended content-type, and enforces its own auth/authorization independent of any page.

## 11. Breadth Pass: Lower-Priority Topics (Track C)

- [ ] 11.1 Forms, redirects & prefetching: read theory.md's Track C entry + `02-guides/forms.md`, `redirecting.md`, `prefetching.md`; verify with a short note on one thing each doc changed your understanding of.
- [ ] 11.2 Draft Mode & Content Security Policy: read `02-guides/draft-mode.md`, `content-security-policy.md`; verify with a short note on whether Draft Mode would help the admin photo-approval flow, and why.
- [ ] 11.3 Data Access Layer & DTOs: read `02-guides/data-security.md` (Data Access Layer section); verify by sketching (in prose, no code) how `server/actions/members.ts` would change if it returned DTOs instead of raw Prisma `Member` rows.
- [ ] 11.4 Production readiness: read `02-guides/environment-variables.md`, `production-checklist.md`, `self-hosting.md`; verify with a short checklist of which items this app already satisfies vs. doesn't.
- [ ] 11.5 UI primitives not yet used: read `03-api-reference/02-components/*` (`next/font`, `next/script`, `next/form`), `04-functions/use-router.md`, `use-search-params.md`, `generate-static-params.md`; verify with a short note on which one is most applicable to `/members`'s existing filters.
- [ ] 11.6 Scale & deployment architecture: read `02-guides/multi-tenant.md`, `multi-zones.md`, `package-bundling.md`, `03-api-reference/07-adapters/*`, `07-edge.md`, `08-turbopack.md`; verify with a short note summarizing one scaling question you could now answer in an interview.
- [ ] 11.7 Content tooling: skim `02-guides/mdx.md`, `sass.md`, `css-in-js.md`, `scripts.md`, `videos.md`; verify with a one-line note per doc on when you'd reach for it (or "not applicable to this stack").
