import { noCache, createUrl, AbortController, AbortError } from '@adobe/helix-fetch';

const fetchKeepAlive = noCache({
    h1: {
        keepAlive: true
    },
    rejectUnauthorized: false   // By default skip auth check for all.
}).fetch;

const fetchAuthorized = noCache().fetch;    // `rejectUnauthorized: true` - by `fetch` default.

const { fetch } = noCache({
    rejectUnauthorized: false   // By default skip auth check for all.
});

function doFetch(fetch_func, options) {
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
    return new Promise((resolve, reject) => {
        fetch_func(uri, fetch_options)
            .then(response => {
                var stream = response.body;
                stream.status = response.status;
                stream.headers = response.headers.plain();
                stream.abortController = abortController;
                resolve(stream);
            })
            .catch(error => {
                if (error instanceof AbortError) {
                    // `AbortError` before `response` occurs only on timeout.
                    error = 'timeout';
                }
                reject(error);
            })
            .finally(() => {
                clearTimeout(timeoutTimerId);
            });
    });
}

export function fetchStreamKeepAlive(options) {
    return doFetch(fetchKeepAlive, options);
}

export function fetchStream(options) {
    return doFetch(fetch, options);
};

export function fetchStreamAuthorized(options) {
    return doFetch(fetchAuthorized, options);
};

export function fetchData(options) {
    var json = options.json;
    var response;
    const fetch_options = Object.assign({}, options);
    const uri = options.qs ? createUrl(options.uri, options.qs) : options.uri;
    return new Promise((resolve, reject) => {
        fetch(uri, fetch_options)
            .then(res => {
                response = res;
                json = json || (response.headers.get('content-type').indexOf('application/json') > -1);
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