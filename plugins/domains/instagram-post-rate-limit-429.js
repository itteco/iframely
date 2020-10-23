module.exports = {

    re: require('./instagram.com').re,

    getData: function(url, __statusCode, options, cb) {

        return __statusCode !== 429

            ? cb({
                responseStatusCode: __statusCode,
            })

            : cb(null, {
                meta: {},
                message: "Instagram is rate-limiting. Meta disabled."
            })
    }
};