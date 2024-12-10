export default {

    provides: 'self',

    getData: function(url, __promoUri, iframelyRun, options, cb) {

        // __promoUri may be not string if no rel=promo need to be added
        // see theplatform plugin for example
        var promoUri = typeof __promoUri !== "string" ? __promoUri.url : __promoUri;

        if (url === promoUri || (options.redirectsHistory && options.redirectsHistory.indexOf(promoUri) > -1)) {
            // Prevent self recursion.
            return cb();
        }

        if (/^\/\//.test(promoUri)) {
            promoUri = 'http:' + promoUri;
        }

        var options2 = {...options, ...{debug: false, mixAllWithDomainPlugin: false}};
        delete options2.promoUri;
        delete options2.jar;

        iframelyRun(promoUri, options2, function(error, data) {

            var wrappedError = null;

            if (error) {
                wrappedError = {
                    promoError: error
                };
            }

            cb(wrappedError, {
                promo: data
            });
        });
    },

    getMeta: function(__promoUri, promo) {
        return {
            promo: typeof __promoUri !== "string" ? __promoUri.url : __promoUri,
            provider: promo.meta && (promo.meta.provider || promo.meta.site),
            provider_url: promo.meta && promo.meta.provider_url // if any;
        };
    },

    getLinks: function(__promoUri, promo) {

        var hasGoodLinks = false;
        var links = promo.links.filter(function(link) {
            var match = CONFIG.PROMO_RELS.filter(rel => link.rel.indexOf(rel) > -1);
            if (match.length > 1 || (match.length > 0 && match.indexOf(CONFIG.R.thumbnail) === -1)) {
                // Detect if has something except thumbnail.
                hasGoodLinks = true;
            }

            if (link.href && link.type === CONFIG.T.text_html && (!link.media || link.media["aspect-ratio"])) {
                // Detect responsive iframes.
                hasGoodLinks = true;
                return true;
            }

            return match.length;
        });

        if (!hasGoodLinks) {
            // Do not return links if have no good links excluding thumbnail.
            return;
        }

        return links.map(function(link) {
            var m = {};
            CONFIG.MEDIA_ATTRS.forEach(function(attr) {
                if (attr in link) {
                    m[attr] = link[attr];
                    delete link[attr];
                }
            });
            if (Object.keys(m).length > 0) {
                link.media = m;
            }
            if (typeof __promoUri === "string") {
                link.rel.push(CONFIG.R.promo);
            }
            return link;
        });
    }
};