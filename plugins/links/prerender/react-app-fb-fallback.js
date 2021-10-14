import * as core from '../../../lib/core.js';
import * as utils from './utils.js';

export default {

    highestPriority: true,

    provides: ['appUriData', 'whenReact'],

    getData: function(url, __appFlag, options, cb) {

        if (options.user_agent === CONFIG.FB_USER_AGENT) {
            return cb();
        }

        var options2 = {...options, ...{
            debug: false,
            refresh: true,
            user_agent: CONFIG.FB_USER_AGENT
        }};

        core.run(url, options2, function(error, data) {

            if (data && data.meta && utils.maybeApp(data.meta)) {
                return cb({
                    responseStatusCode: 415
                });
            } else {
                return cb(error, {
                    appUriData: data,
                    whenReact: true
                });
            }
        });
    },

    getMeta: function(appUriData, whenReact) {
        return {...appUriData.meta}
    },

    getLinks: function(appUriData, whenReact) {
        return appUriData.links;
    }
};