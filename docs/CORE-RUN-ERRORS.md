# Errors in `core.js` `run()`

Reference for [`run(uri, options, cb)`](../lib/core.js#L1823) in [lib/core.js](../lib/core.js).

The callback is `cb(error, data)`. On failure the shape depends on the API version:
- **New API** (`options.v === '1.3'`): `error` is an object with a `code` field.
- **Legacy API** (anything else): `error` is a primitive (string code or numeric status).

---

## A. All possible `cb(error)` values in `run()`

| Cause | New API (`v: '1.3'`) | Legacy API |
|---|---|---|
| Blocked domain (`blacklist`) | `{ code: 'http error', responseCode: 417, messages: [...] }` | `417` |
| Redirect loop | `{ code: 'redirect loop' }` | `'redirect loop'` |
| Retry loop | `{ code: 'retry loop' }` | `'retry loop'` |
| Invalid URL | `{ code: 'invalid url' }` | `'invalid url'` |
| Fetch-param not found | `{ code: 'param not found' }` | `'param not found'` |
| Plugin timeout | `{ code: 'timeout' }` | `'timeout'` |
| Runtime/network error | `{ code: 'request error', error: <err> }` | `<err>` |
| HTTP status error | `{ code: 'http error', responseCode: <status> }` | `<status>` |

New-API error objects may also carry: `messages` (plugin messages), `fetches`
(if `returnFetchUsage`), and data params (via `dataParams`).

**All new-API `code` values:** `'http error'`, `'request error'`, `'timeout'`,
`'redirect loop'`, `'retry loop'`, `'invalid url'`, `'param not found'`.

---

## B. What plugins can return as error

Plugins signal errors through these keys (`SYS_ERRORS`), read by
[`findResponseError()`](../lib/core.js#L1546) and friends:

| Key | Value | Effect in `run()` |
|---|---|---|
| `responseStatusCode` | HTTP status number (e.g. `404`, `415`) | → `http error` / raw status |
| `responseError` | runtime/network error object or message | → `request error` / raw error |
| `timeout` | `'timeout'` | → `timeout` |
| `redirect` | `{ redirect: <url>, status }` | restart run at new URL (not an error) |
| `retry` | `{ retry: {...options} }` | restart run with new options (not an error) |
| `fallback` | `'*'` or `'generic'` | force fallback to generic plugins (not an error) |

### `responseError` attributes

The `responseError` value is the raw runtime/network error from the fetch layer
([`@adobe/fetch`](../node_modules/@adobe/fetch/src/fetch/errors.js)). It is usually a `FetchError`
(which extends `Error`); it may also be a raw Node.js stream/system error. `FetchError` attributes:

| Attribute | Description | Examples |
|---|---|---|
| `name` | Error class name (getter) | `FetchError`, `AbortError` |
| `message` | Human-readable message | `"request to https://… failed, reason: …"` |
| `type` | Error kind | `system`, `request-timeout` |
| `code` | System error code (only when wrapping a system error) | `ECONNRESET`, `ETIMEDOUT`, `ECONNREFUSED`, `EPROTO`, `CERT_HAS_EXPIRED`, `ERR_HTTP2_STREAM_ERROR`, `Z_DATA_ERROR` |
| `errno` | Numeric errno (only when wrapping a system error) | `-104` |
| `erroredSysCall` | Failed syscall (only when wrapping a system error) | `read`, `connect`, `write` |

Only `name`, `message`, and `type` are always present; `code`, `errno`, and `erroredSysCall` are
copied from the underlying system error and exist only when the `FetchError` wraps one
([@adobe/fetch errors.js](../node_modules/@adobe/fetch/src/fetch/errors.js#L45)).

Notes on how `responseError` is consumed:
- In `run()`, `findResponseError` returns `error.message || error`
  ([core.js#L1556](../lib/core.js#L1556)).
- New API classifies it as `'request error'` only when it has **both** `.code` and `.message`;
  otherwise it becomes `'http error'` with `responseCode` ([core.js#L2090](../lib/core.js#L2090)).
- `ENOTFOUND` (DNS) is not sent as `responseError` — it is mapped to `responseStatusCode: 404`
  ([htmlparser.js#L44](../lib/plugins/system/htmlparser/htmlparser.js#L44)).
- `'timeout'` and `'too_many_redirects'` are handled separately (timeout / status `508`), not as
  `responseError`.

Notes:
- A plugin cb error with a `.code` field is normalized to `{ responseStatusCode: <code> }`
  ([core.js#L280](../lib/core.js#L280)) — e.g. oEmbed status codes (`oembedError`).
- Known sources: `404` on DNS `ENOTFOUND`, `415` non-HTML, and non-200 statuses in
  [htmlparser.js](../lib/plugins/system/htmlparser/htmlparser.js),
  [nonHtmlContentData.js](../lib/plugins/system/htmlparser/nonHtmlContentData.js),
  [meta.js](../lib/plugins/system/meta/meta.js).
