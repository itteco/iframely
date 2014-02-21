var utils = require('./utils');

module.exports = {

    getLink: function(meta) {
        return utils.getImageLink('image_src', meta);
    }
};