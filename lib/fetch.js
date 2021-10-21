import { noCache, timeoutSignal, AbortController, createUrl } from '@adobe/helix-fetch';

const { fetch } = noCache();

export function fetchStream(options) {
    const createAbortController = options.createAbortController;
    const abortController = createAbortController ? new AbortController() : null;
    const fetch_options = Object.assign({}, options);
    if (abortController) {
        fetch_options.signal = abortController.signal;
    }
    const uri = options.qs ? createUrl(options.uri, options.qs) : options.uri;
    return new Promise((resolve, reject) => {
        fetch(uri, fetch_options)
            .then(response => {
                var stream = response.body;
                stream.status = response.status;
                stream.headers = response.headers.plain();
                stream.abortController = abortController;
                resolve(stream);
            })
            .catch(reject);
    });
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