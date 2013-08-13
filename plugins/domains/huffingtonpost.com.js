module.exports = {

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

    getData: function($selector) {
        var $body = $selector('.entry_body_text,.articleBody');
        $body.find('.video_box_title,.promo_holder').remove();
        return {
            html_for_readability: $body.html(),
            ignore_readability_error: true
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