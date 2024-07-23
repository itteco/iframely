export default {

    provides: 'meta',

    getData: function(url, __statusCode, options, cb) {

        return __statusCode !== 429 && __statusCode !== 403 &&__statusCode !== 508

            ? cb({
                responseStatusCode: __statusCode,
            })

            : cb(null, {
                meta: {},
                message: `${options.provider || 'Publisher'} is rate-limiting. Meta disabled.`
            })
    }
};