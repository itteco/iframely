module.exports = {

    re: require('./spotify.com').re,

    provides: ['meta'],

    getData: function(url, __statusCode, options, cb) {
        if ([404].includes(__statusCode) 
            && /\/playlist\//.test(url)
            && options.getProviderOptions('spotify.ignore_errors', true)) {

            return cb(null, {
                message: 'Spotify replied with 404 for the playlist. Ignoring.',
                meta: {} // Needed for general plugin not to fall back onto htmlparser errors.
            })

        } else {

            return cb({
                responseStatusCode: __statusCode
            });
        }
    }
};
