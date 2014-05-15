var URL = require("url");

module.exports = {

    re: /^https?:\/\/(?:www\.)?tindeck\.com\/listen\/([-_a-z0-9]+)\/?$/i,

    mixins: [
        "og-image",
        "canonical",
        "og-title",
        "og-description",
        "og-site",
        "keywords",

        "favicon"
    ],

    getLink: function(urlMatch) {
        return {
            href: "http://tindeck.com/player/v1/player.swf?trackid=" + urlMatch[1],
            type: CONFIG.T.flash,
            rel:  CONFIG.R.player,
            width:  466,
            height: 105
        };
    },

    tests: [{
        page: "http://tindeck.com/browse",
        selector: "table td.dataone:nth-child(1) a"
    },
        "http://tindeck.com/listen/pzgv"
    ]
};
