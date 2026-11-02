export default {

    getData: function(url, meta, oembedUtils, __noOembedLinks, options, cb) {

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
                iframelyResponseError: {
                    status: 403,
                    detail: "The robots directive of this page prevented Iframely from parsing it"
                }
            } : null);
    }

};
