module.exports = {

    notPlugin:  !(CONFIG.providerOptions.readability && CONFIG.providerOptions.readability.enabled === true),

    re: /^http:\/\/www\.(huffingtonpost|huffpostmaghreb)\.(com|ca|fr|it|jp|es|co\.uk)\//i,

    mixins: [
        "og-title",
        "og-image",
        "canonical",
        "author",
        "category",
        "og-site",
        "sailthru",
        "keywords",
        "og-description",

        "favicon"
    ],

    getLink: function(cheerio) {

        var $body = cheerio('.entry_body_text,.articleBody');
        $body.find('.video_box_title,.promo_holder').remove();
        return {
            html: $body.html(),
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.reader, CONFIG.R.inline]
        };
    },

    tests: [{
        pageWithFeed: "http://www.huffingtonpost.com/"
    },
        "http://www.huffingtonpost.com/2013/08/12/fan-falls-dies-turner-field-braves_n_3746814.html",
        "http://www.huffingtonpost.com/arianna-huffington/happy-birthday-huffpost-live_b_3746928.html",
        {
            skipMixins: [
                "sailthru"
            ]
        }
    ]

};