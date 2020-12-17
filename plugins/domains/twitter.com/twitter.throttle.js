module.exports = {

    re: require('./twitter.timelines').re.concat(require('./twitter.status').re),

    provides: ["meta"],

    getData: function(url, __statusCode, cb) {
        if (__statusCode === 429 || __statusCode === 400) {
            return cb(null, {meta: {}})
        } else {
            return cb ({
                responseStatusCode: __statusCode
            });
        }
    }
};