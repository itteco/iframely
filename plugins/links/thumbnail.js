import utils from './utils.js';

export default {

    getLink: function(meta) {
        if (!meta.og || !meta.og.image) {
            return utils.getImageLink("thumbnail", meta);
        }
    }
};