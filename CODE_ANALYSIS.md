# Code Analysis

## Current Functionality (master)
- Purpose: Build HTTP request options from compact, rule-driven URIs ("curie"-style) and execute them via `request` with optional promises.
- Core: `index.js` exports a factory that accepts `{ rules }` and returns helpers: `make`, `request`, `requestAsync`, plus docs and schema accessors.
- Rules Engine: Declarative `when`/`then` rules.
  - Triggers include: starts/ends with, contains, regex, has params, tag checks.
  - Actions include: URL replacement, query/header mutations, auth (basic/bearer), OAuth (HMAC/RSA), AWS keys, proxy, JSON, gzip, redirects, jar, timeouts, SSL agent options, and custom metadata.
- Validation: Heavy use of `Joi` to validate input shapes (rules, quest, request options). `shortquest.schema.json` mirrors rules documentation in `RULES.md`.
- Request Execution: `request(quest, cb)` builds options, injects `shortquest` metadata into the response, and supports `requestAsync` via Bluebird. Piping works with the returned `request` stream.
- SSL Handling: If `agentOptions.*Path` is present, files are read and inlined (`cert`, `key`, `pfx`, `ca`) with a simple read-cache; the `*Path` fields are then removed in normalization.
- Normalization: Converts `formList`/`headerList`/`parameterList` arrays into `form`/`headers`/`qs` maps expected by `request`. Removes empty structures and internal tags.
- Tests: Mocha + Chai + Nock cover triggers/actions, normalization, SSL file loading, and request shape.

## Branch Review: basic_rules (origin/basic_rules)
- Goal: Early rules engine and request-option builder.
- Characteristics:
  - Broader, simpler trigger set (e.g., "uri is localhost", "uri is secure"). Regex logic was naïve.
  - Provided many convenience builders (`makeGet`, `makePostJson`, etc.) rather than a single `make` + `request` API.
  - `json` was treated as an object payload (not a boolean flag) and there was no `request` execution wrapper or promises.
  - No `RULES.md` or `shortquest.schema.json` present; validation existed but schema/docs were minimal.
  - No SSL file inlining; only agent option fields.
- Intent: Establish the basic declarative transformation pipeline and ergonomic helpers for common HTTP verbs.

## Branch Review: ssl-cert (origin/ssl-cert)
- Goal: Add first-class SSL certificate support and examples.
- Changes:
  - Introduced inlining of certificate material from file paths: `agentOptions.certPath|keyPath|pfxPath|caPath` -> `cert|key|pfx|ca` with a small cache.
  - Updated tests to use `test/dummy*.txt` as fixtures; README gained examples.
  - Retained the consolidated `make`/`request` API and the JSON Schema introduced just prior.
- Intent: Make rule-driven SSL configuration practical while keeping secrets out of source by reading from paths at build time.

## Reusable Ideas (portable to other stacks)
- Declarative triggers/actions registry: map string keys to small pure functions; compose applicable actions per request.
- Late normalization: build with simple arrays, then convert to the target client’s shape (e.g., `qs`, headers).
- Schema-first: validate config and generated request options early with a machine-readable schema.
- File indirection for secrets: accept `*Path` inputs and inline content at the edge with a read-cache.
- Response enrichment: attach provenance (`shortquest`) to responses for downstream debugging/metrics.

## Potential Drawbacks / Trade-offs
- Dependency choices: `request` is deprecated; `moment` and `string` are heavy. Modern stacks prefer `undici/axios`, `dayjs/luxon`, native string/URL.
- Sync I/O for SSL load: synchronous `fs.readFileSync` can block under load; async with caching is safer.
- Mixed concerns: rules both transform URIs and inject credentials; consider isolating secret handling.
- Mutability and side-effects: builder mutation complicates reasoning; immutable transforms are easier to test.
- Validation drift: `Joi` rules must track `RULES.md` and JSON Schema; duplication risks inconsistency.
- Security posture: examples use legacy SSL options (e.g., `SSLv3_method`) that are obsolete/insecure.

## Modernization Plan (API, Tooling, Types)
- API shape
  - Promise-first API and async/await: deprecate callbacks; keep `request(quest)` returning a Promise and stream support via an explicit `requestStream(quest)`.
  - Separate concerns: expose a pure `buildOptions(quest)` (rules -> options) and a transport layer `send(options)` so the engine is reusable with different HTTP clients.
  - ESM-first with CJS compatibility: provide `exports` map, `type` field, and dual builds if needed.
- Tooling updates
  - Replace Grunt/JSHint with npm scripts + ESLint + Prettier; add `lint`, `format`, `typecheck`, `test` commands.
  - Test runner: move from Mocha/Chai to Vitest or Jest; keep Nock (or MSW for higher-level tests). Add coverage via `c8`.
  - CI: GitHub Actions matrix (Node 18/20/22), cache deps, run lint/tests/coverage. Enable Dependabot or Renovate.
- TypeScript adoption
  - Phase 1: JSDoc types + generated `.d.ts` for public API.
  - Phase 2: Incremental TS migration (`src/*.ts`), build with `tsup` or `tsup/tsc`, emit ESM+CJS and types.
  - Add strict types for rules (string literal unions for triggers/actions) to make configs IDE-friendly.
- Modern dependencies
  - HTTP client: replace `request` with `undici` (native) or `axios`; align options mapping and streaming behavior.
  - Date/time: `moment` -> `dayjs` or `date-fns` (tree-shakable).
  - Strings/URL: drop `string` lib; use native `String`/`URL` and regex. Prefer WHATWG `URL` for query handling.
  - Promises: drop Bluebird; use native Promise and `util.promisify` only if needed.
  - Validation: upgrade `joi` or consider `zod` for dev/runtime type alignment.
  - Lodash: replace easy calls with native methods; keep only targeted utilities if measurable value.
- Distribution
  - Publish minimum bundle with proper `exports`, `sideEffects: false`, and source maps.
  - Maintain semantic versioning and a migration guide (v1 -> v2).
- Effort estimate (rough)
  - HTTP client + API refactor (Promise-first, stream split): 2–4 days.
  - Tooling swap (ESLint/Prettier/Jest or Vitest, GH Actions): 1–2 days.
  - Type safety (JSDoc -> TS phase 1) and types for rules/actions: 1–2 days; full TS migration: +2–3 days.
  - Docs/examples and RULES/Schema alignment: 1 day.
  - Total: approximately 1–2 weeks of engineer time depending on depth (single maintainer pace).

## Alternatives (Similar Libraries)
- Popular HTTP clients
  - `axios`: mature, browser/Node, rich interceptors to emulate rules (map triggers to request interceptors, apply headers/auth/redirects). Ecosystem: retry, auth-refresh.
  - `got`: Node-focused, powerful hooks and plugins; easy to implement trigger/action via `beforeRequest`/`hooks` and per-instance defaults.
  - `undici`/WHATWG `fetch`: modern, standards-based; compose policies in a thin wrapper; use `Request`/`URL` for transformations.
- Other clients
  - `superagent`: long-standing, chainable API; extend via plugins/interceptors.
  - `make-fetch-happen` (npm CLI): fetch with caching, proxies, CA/SSL options; useful for enterprise envs.
  - `needle` / `wreck` / `bent`: lighter alternatives with Node focus; fewer features but small surface area.
- Config-/rules-driven approaches
  - Build a thin “policy engine” atop axios/got/fetch using interceptors/hooks to replicate Shortquest rules without maintaining a custom transport.
  - For URI shortcuts, combine RFC 6570 URL templates (`url-template`, `uritemplate`) or a simple prefix map with the client of choice.
  - For schema/validation, pair with `zod` or `joi` to validate policies and generated requests.
