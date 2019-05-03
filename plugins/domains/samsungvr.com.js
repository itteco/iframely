module.exports = {

    re: /^https?:\/\/samsungvr\.com\/view\/([a-zA-Z0-9_\-]+)/,

    mixins: ["*"],

    getMeta: function () {
        return {
            "media": "player"
        };
    },

    getLinks: function(urlMatch) {

    	return {
    		href: "https://samsungvr.com/watch/" + urlMatch[1],
    		rel: [CONFIG.R.player, CONFIG.R.html5],
    		accept: CONFIG.T.text_html,
    		"aspect-ratio": 16 / 9,
            autoplay: 'autoplay=true'
    	}
    },

    tests: [{
        noFeeds: true
        },
        "https://samsungvr.com/view/O8bauso0wrf",
        "https://samsungvr.com/view/OuYzVHKlEeT",
        "https://samsungvr.com/view/WCBx_30Oah8"
    ]
};