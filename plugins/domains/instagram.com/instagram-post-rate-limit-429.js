export default {

    re: 'instagram.com',

    provides: 'ipOG',

    getData: function(url, __statusCode, options, cb) {

        return __statusCode !== 429 && __statusCode !== 508

            ? cb({
                responseStatusCode: __statusCode,
            })

            : cb(null, {
                ipOG: {},
                message: "Instagram is rate-limiting. Meta disabled."
            })
    }
};