import timelinePlugin from './twitter.timelines.js';
import statusPlugin from './twitter.status.js';

export default {

    re: [...timelinePlugin.re, ...statusPlugin.re],

    provides: ["twitter.og"],

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