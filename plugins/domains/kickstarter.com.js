module.exports = {

    mixins: [
        "og-title",
        "og-description",
        "canonical",
        "oembed-site",
        "oembed-author",
        "shortlink",

        "oembed-video-responsive",        
        "og-image",
        "favicon"
    ],

    tests: [{
        page: "http://www.kickstarter.com/discover/popular?ref=home_popular",
        selector: "h2.bbcard_name a"
    },
        "http://www.kickstarter.com/projects/1104350651/taktik-premium-protection-system-for-the-iphone"
    ]
};