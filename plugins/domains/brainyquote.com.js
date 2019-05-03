module.exports = {

    re: [
        /^https?:\/\/(?:www\.)?brainyquote\.com\/quotes(?:\/quotes)?\/\w\/?/i
    ],

    mixins: [
        "domain-icon",
        "canonical",
        "twitter-description",
        "og-site",
        "twitter-title"
    ],

    getLink: function(og) {
        return {
            href: og.image.url,
            rel: [CONFIG.R.og, og.image.width > 200 ? CONFIG.R.image : CONFIG.R.thumbnail],
            type: og.image.type,
            width: og.image.width,
            height: og.image.height
        };
    },

    tests: [ {
        page: "http://www.brainyquote.com/quotes/authors/a/aristotle.html",
        selector: "a.oncl_q"
    },
        "https://www.brainyquote.com/quotes/quotes/s/socrates107382.html",
        "https://www.brainyquote.com/quotes/quotes/s/socrates101211.html"
    ]
};