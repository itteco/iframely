export default {

    re: ['twitter.status', 'twitter.timelines'],

    provides: ["twitter_og"],

    getData: function(url, __statusCode, cb) {
        // if (__statusCode === 429 || __statusCode === 404 || __statusCode === 403 || __statusCode === 400) {
            return cb(null, {twitter_og: {}})
        /* } else {
            return cb ({
                responseStatusCode: __statusCode
            });
        } */
    }
};