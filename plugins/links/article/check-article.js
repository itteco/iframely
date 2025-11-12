export default {

    provides: [
        "__readabilityEnabled",
        "articlebody"
    ],

    getData: function(meta, options) {

        const ld = meta.ld?.newsarticle || meta.ld?.article || meta.ld?.blogposting || meta.ld?.reportagenewsarticle || meta.ld?.socialmediaposting;

        if (ld
            || (meta.og && (meta.og.type === "article" || meta.og.type === "blog" || meta.og.type === 'website')
            || meta.twitter?.card === 'summary_large_image'
            || meta.article)
            && (options.getRequestOptions('readability.articlebody', false) || CONFIG.providerOptions?.app?.allow_readability === true)) {

            if (ld?.articlebody && /\/>/.test(ld.articlebody)) {
                return {
                    articlebody: ld.articlebody
                }
            } else if (options.getProviderOptions('app.allow_readability')) {
                return {
                    __readabilityEnabled: true
                }
            }
        }
    }
};