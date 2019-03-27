
module.exports = {

    re: /^https?:\/\/(?:\w{2,3}\.)?pinterest(?:\.com?)?\.\w{2,3}\/pin\/(\d+)/i,

    mixins: [
        "*"
    ],

    getLink: function(url, meta, options) {

        var og = meta.og;

        if (/pin/.test(og.type) || // this check sometimes when Pinterest misses cache hits: og.type is 'website' in those cases
            (meta.twitter && meta.twitter.app && meta.twitter.app.url && /\/pin\//i.test(meta.twitter.app.url.iphone))) {

            // https://developers.pinterest.com/tools/widget-builder/?type=pin
            var hide_description = options.getRequestOptions('pinterest.hide_description', false);

            return {
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.app, CONFIG.R.ssl, CONFIG.R.inline, CONFIG.R.html5],
                template: "pinterest.widget",
                template_context: {
                    url: og.url || url,
                    title: "Pinterest Image",
                    type: "embedPin",
                    width: null,
                    height: null,
                    pinWidth: null,
                    hideDescription: hide_description
                },
                options: {
                    hide_description: {
                        label: 'Hide description',
                        value: hide_description
                    }
                },
                'max-width': 600
            };
        }
    },

    getData: function (og, options) {

        if (og.see_also && /^https?:\/\/(?:www\.)?(youtube|vimeo|soundcloud|ted|dailymotion)\.com\//i.test(og.see_also)) {

            return {
                __promoUri: {
                    url: og.see_also,
                    rel: 'No rel=promo is required' // this field is just for debugging here. Not required
                }
            };
        }

    },

    tests: [{
        // No Test Feed here not to violate "scrapping" restrictions of Pinterest
        noFeeds: true
    },
        "https://www.pinterest.com/pin/72831718944016807/",
        "https://www.pinterest.com/pin/211669251206627341/"
    ]
};