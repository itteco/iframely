import utils from './utils.js';

export default {

    getLink: function(meta) {
        return utils.getImageLink('image_src', meta);
    }
};