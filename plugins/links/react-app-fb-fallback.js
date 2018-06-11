var core = require('../../lib/core');
var _ = require('underscore');

module.exports = {

    highestPriority: true,

    provides: 'appUriData',

    getData: function(url, __appFlag, options, cb) {

        if (options.user_agent === CONFIG.FB_USER_AGENT) {
            return cb();
        }

        var options2 = _.extend({}, options, {
            debug: false,
            refresh: true,
            user_agent: CONFIG.FB_USER_AGENT
        });

        core.run(url, options2, function(error, data) {

            var title = data && data.meta && ((data.meta.og && data.meta.og.title) || (data.meta.twitter && data.meta.twitter.title) || data.meta.title || data.meta['html-title']);

            if (!title ||  /^{{.+}}$/.test(title)) {
                return cb({
                    responseStatusCode: 415
                });
            } else {
                return cb(error, {
                    appUriData: data
                });
            }
        });
    },

    getMeta: function(appUriData) {
        return _.extend({}, appUriData.meta);
    },

    getLinks: function(appUriData) {
        return appUriData.links;
    }
};