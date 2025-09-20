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

