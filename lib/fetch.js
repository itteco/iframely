import { URL } from 'url';
import { h1NoCache, noCache, createUrl, AbortController, AbortError, FetchError } from '@adobe/helix-fetch';
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
    
    const fetch_options = Object.assign({}, options);
    
    // Implement `qs` (get params).
    var uri = options.qs ? createUrl(options.uri, options.qs) : options.uri;
    // Remove hash part of url.
    uri = uri.replace(/#.*/gi, '');

    const abortController = new HostAbortController(uri);

    // Allow request abort before finish.
    fetch_options.signal = abortController.signal;
    // Implement `timeout`.
    const timeoutTimerId = setTimeout(() => {
        abortController.abort();
    }, options.timeout || CONFIG.RESPONSE_TIMEOUT);

    const a_fetch_func = options.disable_http2 ? h1_fetch_func: fetch_func;
    return new Promise((resolve, reject) => {
        a_fetch_func(uri, fetch_options)
            .then(response => {
                var stream = response.body;
                stream.on('end', () => {
                    clearTimeout(timeoutTimerId);
                });
                abortController.onResponse(stream);
                stream.status = response.status;
                stream.headers = response.headers.plain();
                stream.abortController = abortController;
                stream.h2 = response.httpVersion === '2.0';
                resolve(stream);
            })
            .catch(error => {
                clearTimeout(timeoutTimerId);
                if (!options.disable_http2 && error.code && /^ERR_HTTP2/.test(error.code)) {
                    log('   -- doFetch http2 error', error.code, uri);
                    resolve(doFetch(fetch_func, h1_fetch_func, Object.assign({}, options, {disable_http2: true})));
                } else {
                    if (!options.disable_http2 && error.code && error instanceof FetchError && error.code === 'ABORT_ERR') {
                        // Special case, when shared session request aborted by htmlparser logic.
                        /**
                         * https://polldaddy.com/poll/7451882/?s=twitter
                         * https://app.everviz.com/show/O0Cy7Dyt
                         */
                        log('   -- doFetch h2 aborted error', uri);
                        resolve(doFetch(fetch_func, h1_fetch_func, Object.assign({}, options, {disable_http2: true})));
                    } else {
                        if (error instanceof AbortError) {
                            // `AbortError` before `response` occurs only on timeout.
                            error = 'timeout';
                        }
                        reject(error);
                    }
                }
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
    var res;
    const fetch_options = Object.assign({}, options);
    const uri = options.qs ? createUrl(options.uri, options.qs) : options.uri;

    const abortController = new HostAbortController(uri);

    // Allow request abort before finish.
    fetch_options.signal = abortController.signal;
    // Implement `timeout`.
    const timeoutTimerId = setTimeout(() => {
        abortController.abort();
    }, options.timeout || CONFIG.RESPONSE_TIMEOUT);

    const a_fetch_func = options.disable_http2 ? fetchH1: fetch;
    return new Promise((resolve, reject) => {
        a_fetch_func(uri, fetch_options)
            .then(response => {
                var stream = response.body;
                // TODO: looks like HEAD request has no END event.
                stream.on('end', () => {
                    clearTimeout(timeoutTimerId);
                });
                abortController.onResponse(stream);
                res = response;
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
                    status: res.status,
                    headers: res.headers.plain(),
                    data: data
                });
            })
            .catch((error) => {
                clearTimeout(timeoutTimerId);
                reject(error);
            });
    });
};

const hostsCache = {};

function addController(ctrl) {
    hostsCache[ctrl.host] = hostsCache[ctrl.host] || [];
    hostsCache[ctrl.host].push(ctrl);
}

function tryAbortHost(host) {
    var controllers = hostsCache[host];
    if (controllers) {
        const hasWaitingRequests = controllers.some(ctrl => ctrl.waiting);
        // If all aborted or finished.
        if (!hasWaitingRequests) {
            while (controllers.length) {
                let ctrl = controllers.pop();
                ctrl.forceAbort();
            }
        }
    }
}

function removeController(ctrl) {
    var controllers = hostsCache[ctrl.host];
    if (controllers) {
        const idx = controllers.indexOf(ctrl);
        controllers.splice(idx, 1);
    }
}

class HostAbortController {

    constructor(url) {
        this.aborted = false;
        this.responded = false;
        this.url = url;
        const parsedUrl = new URL(url);
        this.host = parsedUrl.protocol + parsedUrl.hostname;
        this.abortController = new AbortController();
        addController(this);
    }

    onResponse(stream) {
        this.stream = stream;
        if (this.aborted) {
            stream.pause();
        }
        stream.on('end', () => {
            this.finished = true;
            removeController(this);
            tryAbortHost(this.host);
        });
    }

    abort() {
        this.stream && this.stream.pause();
        this.aborted = true;
        tryAbortHost(this.host);
    }

    forceAbort() {
        if (this.aborted && !this.finished) {
            this.abortController.abort();
        }
    }

    get waiting() {
        return !(this.aborted || this.finished);
    }

    get signal() {
        return this.abortController.signal;
    }
}