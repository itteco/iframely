export default {

    provides: 'meta',

    re: [
        'facebook.post',
        'facebook.video'
    ],

    getData: function(url, __statusCode, options, cb) {

        return __statusCode !== 429 && __statusCode !== 403 &&__statusCode !== 508 
                && __statusCode !== 404 // Real 404s are handled by `fb-error`, the redirects to "/unsupportedbrowser" are likely due to the requirement to be logged in, allowing it.

            ? cb({
                responseStatusCode: __statusCode,
            })

            : cb(null, {
                meta: {},
                message: __statusCode !== 404 ? 'Facebook is rate-limiting. Meta disabled.' : 'Post visibility seem restricted. Allowing.'
            })
    }
};