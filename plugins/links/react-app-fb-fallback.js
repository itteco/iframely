var core = require('../../lib/core');
var _ = require('underscore');

module.exports = {

    highestPriority: true,

    provides: 'reactUriData',

    getData: function(url, __reactAppFlag, options, cb) {

        if (options.user_agent === CONFIG.FB_USER_AGENT) {
            return cb();
        }

        var options2 = _.extend({}, options, {
            debug: false,
            refresh: true,
            user_agent: CONFIG.FB_USER_AGENT
        });

        core.run(url, options2, function(error, data) {

            if (!data.meta || (data.meta.fragment == '!' && /{{.+}}/.test(data.meta.title))) {
                return cb({responseStatusCode: 415});
            } else {
                return cb(error, {
                    reactUriData: data
                });
            }
        });
    },

    getMeta: function(reactUriData) {
        return _.extend({}, reactUriData.meta);
    },

    getLinks: function(reactUriData) {
        return _.extend({}, reactUriData.links);
    }
};