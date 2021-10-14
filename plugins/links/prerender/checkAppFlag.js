import * as utils from './utils.js';

export default {

    provides: '__appFlag',

    getData: function(meta, url, options, cb) {

        if (CONFIG.PRERENDER_URL && url.startsWith(CONFIG.PRERENDER_URL)) {
            return cb();
        }

        if (utils.maybeApp(meta)) {
            return cb(null, {
                __appFlag: true,
                message: "This looks like JS app with no prerender. If you are the owner, please run templates on the server for <a href=\"https://iframely.com/docs/about\">Iframely robot</a>."
            });
        } else {
            return cb();
        }

    }
};