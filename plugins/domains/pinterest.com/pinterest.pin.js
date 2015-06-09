
module.exports = {

    re: /^https?:\/\/(?:www\.)?pinterest\.com\/pin\/(\d+)/i,

    mixins: [
        "*"
    ],

    getLink: function(url, og) {

        if (og.type !== 'pinterestapp:pin') {
            return;
        }

        return {
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.app, CONFIG.R.ssl, CONFIG.R.html5],
            template: "pinterest.widget",
            template_context: {
                url: url,
                title: "Pinterest Image",
                type: "embedPin",
                width: null,
                height: null,
                pinWidth: null
            },
            width: 250
        };
    },

    getData: function (og) {

        if (og.see_also && /^https?:\/\/(?:www\.)?(youtube|vimeo|soundcloud|ted|dailymotion)\.com\//i.test(og.see_also)) {

            return {
                __promoUri: og.see_also
            };

        }

    },

    tests: [{
        // No Test Feed here not to violate "scrapping" restrictions of Pinterest
        noFeeds: true
    },
        "http://pinterest.com/pin/30258628719483308/",
        "https://www.pinterest.com/pin/312296555387898580/" //vimeo (good one)
    ]
};