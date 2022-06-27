import * as oembedUtils from '../../lib/plugins/system/oembed/oembedUtils.js';

export default {

    getData: function(url, meta, __noOembedLinks, options, cb) {

        return cb(
            meta.robots
            && /noindex/i.test(meta.robots)
            && !meta.description
            && !meta.og
            && !meta.twitter
            && /* !oembedLinks */ !oembedUtils.findOembedLinks(null, meta) // null if length == 0.
            && /* !iframelyTargeted */ !Object.keys(meta).some(key => key.indexOf('iframely') === 0)
            && !options.allowNoIndex
            ? {
               responseStatusCode: 403,
               message: "The robots directive of this page prevents Iframely from parsing it"
            } : null);
    }

};