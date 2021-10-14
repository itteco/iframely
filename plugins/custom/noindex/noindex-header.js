import * as pluginUtils from './utils.js';

export default {

    getData: function(htmlparser, cb) {
        var headers = htmlparser.headers;
        if (pluginUtils.checkRobots(headers['x-robots-tag'], cb)) {
            return;
        } else {
            cb();
        }
    }
};