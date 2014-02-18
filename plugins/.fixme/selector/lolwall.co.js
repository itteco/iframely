module.exports = {

    re: /http:\/\/www.lolwall.co\/lol\/\d+/i,

    mixins: [
        "og-title",
        "og-site",
        "canonical",

        "image_src",
        "favicon"
    ],

    getLink: function($selector) {
        var $img = $selector('img.full-image:first').prev();
        return {
            href: $img.attr("data-original"),
            rel: CONFIG.R.image,
            type: CONFIG.T.image,
            width: $img.attr("width"),
            height: $img.attr("height")
        };
    },

    tests: [{
        page: "http://www.lolwall.co/",
        selector: "h4 a"
    },
        "http://www.lolwall.co/lol/270664"
    ]
}