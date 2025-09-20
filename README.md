# [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-url]][daviddm-image]

Rule‑driven HTTP requests with shortcut URIs (curie‑style).

Shortquest lets you describe how to transform compact URIs (e.g. `wiki:Picasso`) into full request options using a small declarative rules engine. It can inject headers, auth, SSL, parameters, and more — then execute the request or just return the built options.

Key features

- Shortcut URIs and contextual replacements (e.g., env → stage)
- Automatic headers/auth/SSL based on rules
- JSON and form support
- Streams, callbacks, and Promise API
- Strong input validation via Joi

## Project Status

This project is at a crossroads: its future direction and maintenance status are under evaluation. Before adopting in new projects, review modernization options and alternatives in `CODE_ANALYSIS.md`. Contributions are welcome to help decide whether to evolve the library (modern HTTP client, TypeScript, updated tooling) or to archive it in favor of a thin rules layer atop a maintained client.

## Install

```sh
$ npm install --save shortquest
```

## Quick Start

```js
const shortquest = require("shortquest");

const rulesConf = {
  rules: [
    {
      when: [{ trigger: "uri starts with", value: "wiki:" }],
      then: [
        { action: "replace start", values: ["wiki:", "http://mywiki.com/"] },
      ],
    },
  ],
};

const sq = shortquest(rulesConf);

// Callback style
sq.request("wiki:picasso", (err, res, body) => {
  if (err) return console.error(err);
  console.log(body); // body for http://mywiki.com/picasso
});

// Promise/async style
(async () => {
  const [res, body] = await sq.requestAsync("wiki:picasso");
  console.log(res.statusCode, body);
})();
```

## Rules Overview

- All triggers and actions are documented in `RULES.md`.
- A JSON Schema for rules is available in `shortquest.schema.json`.

Example rule: replace prefix and add a header

```json
{
  "rules": [
    {
      "when": [{ "trigger": "uri starts with", "value": "api:" }],
      "then": [
        {
          "action": "replace start",
          "values": ["api:", "https://api.example.com/"]
        },
        {
          "action": "set header parameter",
          "values": ["X-Client", "shortquest"]
        }
      ]
    }
  ]
}
```

## Common Examples

POST JSON (enable JSON handling via rule)

```js
sq.request(
  {
    uri: "api:articles",
    method: "POST",
    body: { title: "good story" },
  },
  cb
);
// Add rule: { action: 'set JSON', values: ['yes'] }
```

Query params and forms

```js
sq.request({ uri: "wiki:picasso", parameterObj: { search: "birth" } }, cb);
sq.request(
  { uri: "api:submit", method: "POST", formObj: { firstName: "Pablo" } },
  cb
);
```

Tags (used by rules)

```js
sq.request(
  { uri: "wiki:picasso", method: "POST", tags: ["sandbox", "XML"] },
  cb
);
```

Streaming/piping

```js
const r1 = sq.request("curie:latest/123.jpg");
const requests = require("request");
r1.pipe(requests.request({ uri: "curie:update/post123.json", method: "POST" }));
```

SSL from file paths

```js
const rulesConf = {
  rules: [
    {
      when: [{ trigger: "uri starts with", value: "curie:" }],
      then: [
        {
          action: "set SSL client",
          values: ["test/dummy1.txt", "test/dummy2.txt", "pass123"],
        },
        {
          action: "set SSL Certificate Authority",
          values: ["test/dummy3.txt"],
        },
        { action: "replace start", values: ["curie:", "http://myweb.com/"] },
      ],
    },
  ],
};
```

Schema & docs

- See `RULES.md` for the full list of triggers and actions.
- See `shortquest.schema.json` for a machine‑readable schema of rules.

## API Surface

- `shortquest(rules)`: factory returning an API.
- `api.make(quest)`: build request options without executing.
- `api.request(quest, cb)`: execute with callback.
- `api.requestAsync(quest)`: Promise that resolves to `[response, body]`.
- `api.triggersDoc()` / `api.actionsDoc()`: programmatic docs.
- `api.jsonSchema()`: JSON Schema for rules.

## Development

- Run tests: `npm test`
- Contributing: see `AGENTS.md`
- Architecture and modernization notes: see `CODE_ANALYSIS.md`

## License

MIT © [Olivier Huin]()

[npm-url]: https://npmjs.org/package/shortquest
[npm-image]: https://badge.fury.io/js/shortquest.svg
[travis-url]: https://travis-ci.org/flarebyte/shortquest
[travis-image]: https://travis-ci.org/flarebyte/shortquest.svg?branch=master
[daviddm-url]: https://david-dm.org/flarebyte/shortquest.svg?theme=shields.io
[daviddm-image]: https://david-dm.org/flarebyte/shortquest
