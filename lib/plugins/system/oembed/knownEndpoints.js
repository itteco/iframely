import * as oembedUtils from './oembedUtils.js';

export default {

    provides: ['oembedLinks', '__noOembedLinks'],

    getData: function(url) {
        var oembedLinks = oembedUtils.findOembedLinks(url);
        return {
            oembedLinks: oembedLinks,
            __noOembedLinks: !oembedLinks || !oembedLinks.length || null    // null - means value not in context.
        };
    }
};