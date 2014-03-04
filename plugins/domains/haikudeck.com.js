module.exports = {
    re: [
        /^http?:\/\/www\.haikudeck\.com\/p\/([a-zA-Z0-9]+)\/([a-zA-Z0-9_\-]+)$/i,
    ],

    mixins: [
        "oembed-title",
        "oembed-thumbnail",
        "oembed-site",
        "oembed-author"
    ],

   getLinks: function(urlMatch) {
        return [{
            href: "http://www.haikudeck.com/e/" + urlMatch[1],
            type: CONFIG.T.text_html,
            rel: CONFIG.R.player,
            "aspect-ratio": 640 / 541
        }, {
            href: "http://static.haikudeck.com/images/haikudeck-icon.png",
            type: CONFIG.T.image,
            rel: CONFIG.R.icon,            
        }];
    },

    tests: [{
        page: "http://www.haikudeck.com/gallery/featured",
        selector: "h4 a"

    },
        "http://www.haikudeck.com/p/cvVNYemLrm/gone-viral---from-unbearably-boring-to-engaging-contagious-content"
    ]
};
