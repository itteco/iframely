export default {

    provides: 'meta',

    re: [
        'facebook.post',
        'facebook.video'
    ],

    getData: function(url, __statusCode, options, cb) {

        return __statusCode !== 429 && __statusCode !== 403 &&__statusCode !== 508

            ? cb({
                responseStatusCode: __statusCode,
            })

            : cb(null, {
                meta: {},
                message: `Facebook is rate-limiting. Meta disabled.`
            })
    }
};