var pluginUtils = require('./utils');

module.exports = {

    getData: function(htmlparser, cb) {
        var headers = htmlparser.headers;
        if (pluginUtils.checkRobots(headers['x-robots-tag'], cb)) {
            return;
        } else {
            cb();
        }
    }
};