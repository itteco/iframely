import spotify_com from './spotify.com.js';

export default {

    re: spotify_com.re,

    provides: ['meta'],

    getData: function(url, __statusCode, options, cb) {
        if ([404].includes(__statusCode) 
            && /\/playlist\//.test(url)
            && options.getProviderOptions('spotify.ignore_errors', true)

            || [500, 503, 502, 406, 403].includes(__statusCode)
            ) {

            return cb(null, {
                message: 'Spotify replied with error. Ignoring.',
                meta: {} // Needed for general plugin not to fall back onto htmlparser errors.
            })

        } else {

            return cb({
                responseStatusCode: __statusCode
            });
        }
    }
};
