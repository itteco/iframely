import { h1NoCache, noCache, createUrl, AbortController, AbortError } from '@adobe/helix-fetch';
import log from '../logging.js';

const fetchKeepAlive = noCache({
    h1: {
        keepAlive: true
    },
    rejectUnauthorized: false   // By default skip auth check for all.
}).fetch;

const fetchH1KeepAlive = h1NoCache({
    h1: {
        keepAlive: true
    },
    rejectUnauthorized: false   // By default skip auth check for all.
}).fetch;

const fetchAuthorized = noCache().fetch;    // `rejectUnauthorized: true` - by `fetch` default.
const fetchH1Authorized = h1NoCache().fetch;      // `rejectUnauthorized: true` - by `fetch` default.

const { fetch } = noCache({
    rejectUnauthorized: false   // By default skip auth check for all.
});

const fetchH1 = h1NoCache({
    rejectUnauthorized: false   // By default skip auth check for all.
}).fetch;

function doFetch(fetch_func, h1_fetch_func, options) {
    const abortController = new AbortController();
    const fetch_options = Object.assign({}, options);
    // Allow request abort before finish.
    fetch_options.signal = abortController.signal;
    // Implement `timeout`.
    const timeoutTimerId = setTimeout(() => {
        abortController.abort()
    }, options.timeout || CONFIG.RESPONSE_TIMEOUT);
    // Implement `qs` (get params).
    const uri = options.qs ? createUrl(options.uri, options.qs) : options.uri;
    const a_fetch_func = options.disable_http2 ? h1_fetch_func: fetch_func;
    return new Promise((resolve, reject) => {
        a_fetch_func(uri, fetch_options)
            .then(response => {
                var stream = response.body;
                stream.status = response.status;
                stream.headers = response.headers.plain();
                stream.abortController = abortController;
                stream.h2 = response.httpVersion === '2.0';
                resolve(stream);
            })
            .catch(error => {
                if (!options.disable_http2 && error.code && /^ERR_HTTP2/.test(error.code)) {
                    log('   -- doFetch http2 error', error.code, uri);
                    resolve(doFetch(fetch_func, h1_fetch_func, Object.assign({}, options, {disable_http2: true})));
                } else {
                    if (error instanceof AbortError) {
                        // `AbortError` before `response` occurs only on timeout.
                        error = 'timeout';
                    }
                    reject(error);
                }
            })
            .finally(() => {
                clearTimeout(timeoutTimerId);
            });
    });
}

export function fetchStreamKeepAlive(options) {
    return doFetch(fetchKeepAlive, fetchH1KeepAlive, options);
}

export function fetchStream(options) {
    return doFetch(fetch, fetchH1, options);
};

export function fetchStreamAuthorized(options) {
    return doFetch(fetchAuthorized, fetchH1Authorized, options);
};

export function fetchData(options) {
    var json = options.json;
    delete options.json;
    var response;
    const fetch_options = Object.assign({}, options);
    const uri = options.qs ? createUrl(options.uri, options.qs) : options.uri;
    const a_fetch_func = options.disable_http2 ? fetchH1: fetch;
    return new Promise((resolve, reject) => {
        a_fetch_func(uri, fetch_options)
            .then(res => {
                response = res;
                if (json !== false) {
                    // If `json` not forbidden, read `content-type`.
                    json = json || (response.headers.get('content-type').indexOf('application/json') > -1);
                }
                if (json) {
                    return response.json();
                } else {
                    return response.text();
                }
            })
            .then(data => {
                resolve({
                    status: response.status,
                    headers: response.headers.plain(),
                    data: data
                });
            })
            .catch(reject);
    });
};