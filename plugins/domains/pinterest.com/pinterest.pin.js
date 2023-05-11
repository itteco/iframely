
export default {

    re: /^(https?:\/\/(?:\w{2,3}\.)?pinterest(?:\.com?)?\.\w{2,3})\/pin\/(?:[^\/]+\-)?(\d+)/i,

    mixins: [
        "*"
    ],

    // https://developers.pinterest.com/tools/widget-builder/?type=pin&terse=true&size=large
    getLink: function(urlMatch, iframe, options) {

        if (iframe.query?.id) {

            // https://developers.pinterest.com/tools/widget-builder/?type=pin
            var hide_description = options.getRequestOptions('pinterest.hide_description', false);

            return {
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.app, CONFIG.R.ssl, CONFIG.R.inline],
                template: "pinterest.widget",
                template_context: {
                    url: `${urlMatch[1]}/pin/${urlMatch[2]}`,
                    title: "Pinterest Image",
                    type: "embedPin",
                    width: null,
                    height: null,
                    pinWidth: null,
                    hideDescription: hide_description
                },
                // Pinterest doesn't show description with any settings as of Oct 6, 2020
                /*
                options: {
                    hide_description: {
                        label: 'Hide description',
                        value: hide_description
                    }
                },
                */
                'aspect-ratio': iframe.width && iframe.height ? iframe.width / iframe.height: 1/1,
                'padding-bottom': 96,
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
        // No test feed here please not to violate "scrapping" restrictions of Pinterest
        noFeeds: true,
        skipMethods: ['getData']
    },
        "https://www.pinterest.com/pin/99360735500167749/",
        "https://www.pinterest.com/pin/211669251206627341/",
        "https://www.pinterest.ca/pin/705024516672989568/",
        "https://www.pinterest.ca/pin/oven-baked-spaghetti-bolognese--492649949494109/"
    ]
};