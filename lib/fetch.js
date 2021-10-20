import { fetch, AbortController } from '@adobe/helix-fetch';

export function fetchStream(options) {
    const createAbortController = options.createAbortController;
    const abortController = createAbortController ? new AbortController() : null;
    const fetch_options = Object.assign({}, options, {
        signal: abortController && abortController.signal
    });
    return new Promise((resolve, reject) => {
        fetch(options.uri, fetch_options)
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