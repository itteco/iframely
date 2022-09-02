export default {

    re: /^https?:\/\/(?:\w{2,3}\.)?pinterest(?:\.com?)?\.\w{2,3}\/((?!pin)[a-zA-Z0-9%_]+|pinterest)\/?(?:$|\?|#)/i,

    mixins: [
        "og-image",
        "favicon",
        "canonical",
        "og-description",
        "og-site",
        "og-title"
    ],    

    getLink: function(url, meta, options) {

        var og = meta.og;

        if (/profile/.test(og.type) || // this check sometimes when Pinterest misses cache hits: og.type is 'website' in those cases
            (meta.twitter && meta.twitter.app && meta.twitter.app.url && /\/user\//i.test(meta.twitter.app.url.iphone))) {

            var height = options.getRequestOptions('pinterest.height', options.maxHeight || 600);
            var width = options.getRequestOptions('pinterest.width', options.getRequestOptions('maxwidth', 600));
            var pinWidth = options.getRequestOptions('pinterest.pinWidth', 120);

            return {
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.app, CONFIG.R.ssl, CONFIG.R.inline],
                template: "pinterest.widget",
                template_context: {
                    url: og.url || url,
                    title: "Pinterest User",
                    type: "embedUser",
                    width: width,
                    height: height,
                    pinWidth: pinWidth
                },
                options: {
                    pinWidth: {
                        label: 'Pin Width',
                        value: pinWidth,
                        placeholder: 'ex.: 120, in px'
                    },
                    width: {
                        label: CONFIG.L.width,
                        value: width,
                        placeholder: 'ex.: 600, in px'
                    },
                    height: {
                        label: CONFIG.L.height,
                        value: height,
                        placeholder: 'ex.: 600, in px'
                    }
                },
                'max-width': width, // inline HTML should have only height now
                height: height + 120
            };
        }
    },

    tests: [{
        // No Test Feed here not to violate "scrapping" restrictions of Pinterest
        noFeeds: true,
        skipMixins: ["og-title", "og-description"]
    },
        "http://pinterest.com/bcij/",
        "http://pinterest.com/franktofineart/",
        "https://www.pinterest.com/pinterest/"
    ]
};