import * as pluginUtils from './utils.js';

export default {

    getData: function(meta, cb) {
        if (pluginUtils.checkRobots(meta.robots, cb)) {
            return;
        } else {
            cb();
        }
    }
};