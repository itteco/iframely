import twitter_timelines from './twitter.timelines.js';
import twitter_status from './twitter.status.js';

export default {

    re: twitter_timelines.re.concat(twitter_status.re),

    provides: ["meta"],

    getData: function(url, __statusCode, cb) {
        // if (__statusCode === 429 || __statusCode === 404 || __statusCode === 403 || __statusCode === 400) {
            return cb(null, {meta: {}})
        /* } else {
            return cb ({
                responseStatusCode: __statusCode
            });
        } */
    }
};