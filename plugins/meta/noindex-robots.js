module.exports = {

    getData: function(url, meta, __noOembedLinks, cb) {

        return cb(meta.robots && /noindex/i.test(meta.robots) && !meta.description && !meta.og && !meta.twitter
        		&& !(meta.alternate && meta.alternate.filter(function(link) {
        			return /^(application|text)\/(xml|json)\+oembed$/i.test(link.type);
    			}))
            ? {
               responseStatusCode: 403,
               message: "The robots directive of this page prevents Iframely from parsing it"
            } : null);
    }

};