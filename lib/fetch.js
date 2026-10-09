import { URL } from 'url';
import dns from 'node:dns';
import { h1NoCache, noCache, createUrl, AbortController, AbortError, FetchError } from '@adobe/fetch';
import { serialize as serializeCookie, parse as parseCookie } from 'cookie';
import log from '../logging.js';

/*
import diagnostics_channel from 'node:diagnostics_channel';

// Log the actual IP each outgoing connection is made to.
diagnostics_channel.subscribe('net.client.socket', ({ socket }) => {
    socket.once('connect', () => {
        // Skip non-http connections (redis, etc.).
        if (socket.remotePort !== 443 && socket.remotePort !== 80) return;
        const host = socket.servername || socket._host || '';
        log(`   -- connected`, host, `${socket.remoteAddress} (${socket.remoteFamily}):${socket.remotePort}`);
    });
});
*/

const makeLookup = (order) => (hostname, options, callback) =>
    dns.lookup(hostname, { ...options, order }, callback);

// Debug lookup.
/*
const makeLookup = (order) => (hostname, options, callback) =>
    dns.lookup(hostname, { ...options, order }, (error, address, family) => {
        if (error) {
            log(`   -- lookup ${order} error`, hostname, error.code, error.message);
        } else if (Array.isArray(address)) {
            // With autoSelectFamily lookup is called with `all: true`.
            log(`   -- lookup ${order}`, hostname, address.map(a => `${a.address} (v${a.family})`).join(', '));
        } else {
            log(`   -- lookup ${order}`, hostname, `${address} (v${family})`);
        }
        callback(error, address, family);
    });
*/

// `ipv6first` order requires Node >= 20.13. autoSelectFamily falls back to the other family on connect failure.
const ORDER_DEFAULT = 'default';
const ORDER_IPV6_FIRST = 'ipv6first';
const ORDER_IPV4_FIRST = 'ipv4first';

const LOOKUPS = {
    [ORDER_DEFAULT]: undefined,     // Node's global resolver order.
    [ORDER_IPV6_FIRST]: { lookup: makeLookup(ORDER_IPV6_FIRST) },
    [ORDER_IPV4_FIRST]: { lookup: makeLookup(ORDER_IPV4_FIRST) }
};

const PROFILE_DEFAULT = 'default';
const PROFILE_KEEP_ALIVE = 'keepAlive';
const PROFILE_AUTHORIZED = 'authorized';

const PROFILES = {
    [PROFILE_DEFAULT]:    {
        rejectUnauthorized: false,  // By default skip auth check for all.
        h2: { enablePush: false }
    },
    [PROFILE_KEEP_ALIVE]: {
        rejectUnauthorized: false,
        h1: { keepAlive: true },
        h2: { enablePush: false }
    },
    [PROFILE_AUTHORIZED]: {         // `rejectUnauthorized: true` - by `fetch` default.
        h2: { enablePush: false }
    }
};

const H1 = 'h1';
const H2 = 'h2';

const FETCH_BY_PROTOCOL = {
    [H1]: h1NoCache,
    [H2]: noCache
};

// Lazily created fetch contexts, memoized per profile/protocol/dns order combination.
const fetchFuncs = {};
/*
Generates fetches like:

const fetchKeepAlive = noCache({
    h1: {
        keepAlive: true
    },
    h2: {
        enablePush: false
    },
    rejectUnauthorized: false   // By default skip auth check for all.
}).fetch;

const fetchH1KeepAlive = h1NoCache({
    h1: {
        keepAlive: true
    },
    rejectUnauthorized: false   // By default skip auth check for all.
}).fetch;

const fetchAuthorized = noCache({
    h2: {
        enablePush: false
    }
}).fetch;                       // `rejectUnauthorized: true` - by `fetch` default.

const fetchH1Authorized = h1NoCache().fetch;      
                                // `rejectUnauthorized: true` - by `fetch` default.

const fetch = noCache({
    h2: {
        enablePush: false
    },
    rejectUnauthorized: false   // By default skip auth check for all.
}).fetch;

const fetchH1 = h1NoCache({
    rejectUnauthorized: false   // By default skip auth check for all.
}).fetch;
*/

function getFetchFunc(profile, protocol, order) {
    const key = `${profile}:${protocol}:${order}`;
    if (!fetchFuncs[key]) {
        const profileOpts = PROFILES[profile];
        const lookup = LOOKUPS[order];
        const h1 = { ...profileOpts.h1, ...lookup };
        const h2 = { ...profileOpts.h2, ...lookup };
        const fetchOptions = { ...profileOpts, h1, h2 };
        const fetchFunc = FETCH_BY_PROTOCOL[protocol];
        fetchFuncs[key] = fetchFunc(fetchOptions).fetch;
    }
    return fetchFuncs[key];
}

export function skipLoggingFetchError(error) {
    return error?.name === 'AbortError' 
        || error?.code === 'ECONNRESET'
        || error?.code === 'ERR_STREAM_PREMATURE_CLOSE'
        || error?.code === 'ERR_HTTP2_STREAM_ERROR'
        || error?.code === 'ERR_HTTP2_SESSION_ERROR'
        || error?.code === 'Z_DATA_ERROR'
        || error?.code === 'Z_BUF_ERROR'
        || error?.code === 'ETIMEDOUT';
}

function selectFetchFunc(options, profile = PROFILE_DEFAULT) {
    let order = ORDER_DEFAULT;
    if (options.ipv6first) {
        order = ORDER_IPV6_FIRST;
    } else if (options.ipv4first) {
        order = ORDER_IPV4_FIRST;
    }
    return getFetchFunc(profile, options.disable_http2 ? H1 : H2, order);
}

function doFetch(profile, options) {
    
    const fetch_options = Object.assign({}, options);
    const is_head_request = fetch_options.method === 'HEAD';
    
    // Implement `qs` (get params).
    var uri = options.qs ? createUrl(options.uri, options.qs) : options.uri;
    // Remove hash part of url.
    uri = uri.replace(/#.*/gi, '');

    // Prevent decode body for head request.
    if (is_head_request) {
        fetch_options.decode = false;
    }

    const abortController = new HostAbortController(uri);

    // Allow request abort before finish.
    fetch_options.signal = abortController.signal;
    // Implement `timeout`.
    const timeoutTimerId = setTimeout(() => {
        abortController.abort();
    }, options.timeout || CONFIG.RESPONSE_TIMEOUT);

    const a_fetch_func = selectFetchFunc(options, profile);
    return new Promise((resolve, reject) => {
        a_fetch_func(uri, fetch_options)
            .then(response => {
                var headers = response.headers.plain();
                var cookies = response.headers.raw()['set-cookie'];
                if (cookies) {
                    // Keep cookies as array of strings.
                    headers['set-cookie'] = cookies;
                }
                var stream = response.body;
                stream.on('end', () => {
                    clearTimeout(timeoutTimerId);
                });
                // Catch async stream errors (e.g. brotli/gzip decode on truncated responses) to avoid unhandled 'error' crashes.
                stream.on('error', (err) => {
                    clearTimeout(timeoutTimerId);
                    if (skipLoggingFetchError(err)) return;
                    log('   -- doFetch stream error', uri, err?.code, err?.name, err?.message);
                });
                abortController.onResponse(stream);

                if (response.status !== 200 && !options.disable_http2 && response.httpVersion === '2.0'
                    && CONFIG.DISABLE_HTTP2_CHECKS?.some(check => typeof check === 'function'
                                                                && check(response.status, headers))) {
                    log('   -- doFetch check disabled h2', uri);
                    resolve(doFetch(profile, Object.assign({}, options, {disable_http2: true})));
                } else {
                    stream.status = response.status;
                    if (response.url && response.url !== uri) { // Set as final destination url if Fetch follows 301/302 re-directs
                        stream.url = response.url;
                    }
                    stream.headers = headers;
                    stream.abortController = abortController;
                    stream.h2 = response.httpVersion === '2.0';
                    // HEAD body is empty and no caller reads it; drain so 'end' fires and the socket is released.
                    if (is_head_request) {
                        stream.resume();
                    }
                    resolve(stream);
                }
            })
            .catch(error => {
                clearTimeout(timeoutTimerId);
                if (!options.disable_http2 && error.code && /^ERR_HTTP2/.test(error.code)) {

                    log('   -- doFetch http2 error', error.code, uri);
                    resolve(doFetch(profile, Object.assign({}, options, {disable_http2: true})));

                } else if (!options.disable_http2 && error.code && error instanceof FetchError && error.code === 'ABORT_ERR') {

                    // Special case, when shared session request aborted by htmlparser logic.
                    /**
                     * https://polldaddy.com/poll/7451882/?s=twitter
                     * https://app.everviz.com/show/O0Cy7Dyt
                     */
                    log('   -- doFetch h2 aborted error', uri);
                    resolve(doFetch(profile, Object.assign({}, options, {disable_http2: true})));

                } else if (!options.stopRecursion && CONFIG.ERRORS_TO_RETRY?.some(code => error.code?.indexOf(code) > -1)) {

                    log('   -- doFetch ECONNRESET retry', error.code, uri);
                    resolve(doFetch(profile, Object.assign({}, options, {stopRecursion: true, disable_http2: true})));

                } else {
                    if (error instanceof AbortError) {
                        // `AbortError` before `response` occurs only on timeout.
                        error = 'timeout';
                    }
                    reject(error);
                }
            });
    });
}

export function fetchStreamKeepAlive(options) {
    return doFetch(PROFILE_KEEP_ALIVE, options);
}

export function fetchStream(options) {
    return doFetch(PROFILE_DEFAULT, options);
};

export function fetchStreamAuthorized(options) {
    return doFetch(PROFILE_AUTHORIZED, options);
};

export function fetchData(options) {
    var json = options.json;
    delete options.json;
    var res;

    const fetch_options = Object.assign({}, options);
    const is_head_request = fetch_options.method === 'HEAD';

    const uri = options.qs ? createUrl(options.uri, options.qs) : options.uri;

    // Prevent decode body for head request.
    if (is_head_request) {
        fetch_options.decode = false;
    }

    const abortController = new HostAbortController(uri);

    // Allow request abort before finish.
    fetch_options.signal = abortController.signal;
    // Implement `timeout`.
    const timeoutTimerId = setTimeout(() => {
        abortController.abort();
    }, options.timeout || CONFIG.RESPONSE_TIMEOUT);

    const a_fetch_func = selectFetchFunc(options);
    return new Promise((resolve, reject) => {
        a_fetch_func(uri, fetch_options)
            .then(response => {
                var stream = response.body;
                stream.on('end', () => {
                    clearTimeout(timeoutTimerId);
                });
                // Catch async stream errors (e.g. brotli/gzip decode on truncated responses) to avoid unhandled 'error' crashes.
                stream.on('error', (err) => {
                    clearTimeout(timeoutTimerId);
                    if (skipLoggingFetchError(err)) return;
                    log('   -- fetchData stream error', uri, err?.code, err?.name, err?.message);
                });
                abortController.onResponse(stream);
                res = response;
                
                if (is_head_request) {
                    // Empty data for HEAD request — drain body so 'end' fires and the socket is released.
                    stream.resume();
                    return Promise.resolve('');
                } else {

                    if (json !== false) {
                        // If `json` not forbidden, read `content-type`.
                        json = json || (response.headers.get('content-type').indexOf('application/json') > -1);
                    }

                    if (json) {
                        return response.json();
                    } else {
                        return response.text();
                    }
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
        const finish = () => {
            if (this.finished) return;
            this.finished = true;
            removeController(this);
            tryAbortHost(this.host);
        };
        stream.on('end', finish);
        // Stream errors out (e.g. brotli/gzip decode failure, socket reset) without an 'end' event.
        stream.on('error', finish);
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

const cookiesOptions = [
    'domain',
    'expires',
    'httponly',
    'max-age',
    'partitioned',
    'path',
    'secure',
    'samesite',
];

// Keep cookie values verbatim: default decode/encode (decodeURIComponent/encodeURIComponent)
// corrupts base64 values containing '/', '+', '=' on round-trip.
const identity = v => v;

export function extendCookiesJar(uri, jar, headers) {
    var cookiesValue = headers && headers['set-cookie'];
    if (cookiesValue) {
        var cookiesArray = Array.isArray(cookiesValue) ? cookiesValue : [cookiesValue];
        try {
            var cookies = cookiesArray.reduce((allCookies, cookieStr) => {
                return { ...allCookies, ...parseCookie(cookieStr, { decode: identity }) };
            }, {});
            // Filter cookies options.
            cookies = Object.fromEntries(Object.entries(cookies).filter(([k,v]) => !cookiesOptions.includes(k.toLowerCase())));
            jar = jar || {};
            jar = {...jar, ...cookies};
        } catch(ex) {
            log('Error parse cookie', uri, ex.message);
        }
    }
    return jar;
}

export function setCookieFromJar(uri, headers, jar) {
    if (jar) {
        try{
            var cookies = Object.entries(jar).map(([k,v]) => serializeCookie(k, v, { encode: identity })).join('; ');
            headers['Cookie'] = cookies;
        } catch(ex) {
            log('Error serialize cookie', uri, ex.message);
        }
    }
}
