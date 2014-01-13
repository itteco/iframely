module.exports = {

    re: [
        /^http:\/\/9gag\.com\/gag\/([a-z0-9\-]+)/i
    ],

    mixins: [
        "twitter-image-rel-image",
        "favicon",
        "og-description",
        "og-site",
        "og-title",
        "canonical"
    ],
    
    tests: [ {
        page: "http://9gag.com",
        selector: "h1 a.badge-section-link-target"
    },
        "http://9gag.com/gag/5500821"
    ]
};
