var pluginUtils = require('./utils');

module.exports = {

    getData: function(meta, cb) {
        if (pluginUtils.checkRobots(meta.robots, cb)) {
            return;
        } else {
            cb();
        }
    }
};