import utils from './utils.js';

export default {

    notPlugin: !CONFIG.PRERENDER_URL,

    getData: function(meta, cb) {

        if (utils.maybeSPA(meta)) {

            return cb({
                retry: {
                    prerender: true
                },
                message: "This looks like JS app with no prerender. If you are the owner, please run templates on the server for <a href=\"https://iframely.com/docs/about\">Iframely robot</a>."
            });

        } else {
            return cb();
        }
    }
};