const core = require('../../../lib/core');
const utils = require('./utils');

module.exports = {

    highestPriority: true,

    provides: 'appUriData',

    getData: function(url, __appFlag, options, meta, cb) {

        var titleBefore = meta && ((meta.og && meta.og.title) || (meta.twitter && meta.twitter.title) || meta.title || meta['html-title']);

        if (CONFIG.PRERENDER_URL && options.user_agent === CONFIG.FB_USER_AGENT) {

            var prerenderUrl = CONFIG.PRERENDER_URL + encodeURIComponent(url);
            var options2 = {...options, ...{
                debug: false,
                refresh: true
            }};

            core.run(prerenderUrl, options2, function(error, data) {

                var title = data && data.meta && ((data.meta.og && data.meta.og.title) || (data.meta.twitter && data.meta.twitter.title) || data.meta.title || data.meta['html-title']);

                if (data && data.meta && utils.maybeApp(data.meta)) {
                    return cb({
                        responseStatusCode: 415
                    });
                } else {
                    if (data.meta.canonical
                        && data.meta.canonical.startsWith(CONFIG.PRERENDER_URL)
                    ) {
                        delete data.meta.canonical;
                    }
                    return cb(error, {
                        appUriData: data
                    });
                }
            });
        } else {
            return cb();
        }
    },

    getMeta: function(appUriData) {
        return {...appUriData.meta};
    },

    getLinks: function(appUriData) {
        return {...appUriData.links};
    }
};