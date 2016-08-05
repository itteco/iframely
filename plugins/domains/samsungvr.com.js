module.exports = {

    re: /^https?:\/\/samsungvr\.com\/view\/([a-zA-Z0-9_\-]+)/,

    mixins: ["*"],

    highestPriority: true,

    // highestPriority + 'meta' in getMeta forces this code run after media-detector and override it result.
    getMeta: function (meta) {
        return {
            "media": "player"
        };
    },

    getLinks: function(urlMatch) {

    	return [
        // wait until they put a proper image placeholder for player that doesn't autoplay
        /*{
    		href: "https://samsungvr.com/watch/" + urlMatch[1],
    		rel: [CONFIG.R.player, CONFIG.R.html5],
    		type: CONFIG.T.text_html,
    		"aspect-ratio": 16 / 9
    	}, */
        {
            href: "https://samsungvr.com/watch/" + urlMatch[1] + '?autoplay=true',
            rel: [CONFIG.R.player, CONFIG.R.html5, CONFIG.R.autoplay],
            type: CONFIG.T.text_html,
            "aspect-ratio": 16 / 9
        }];
    },

    tests: [{
        noFeeds: true
        },
        "https://samsungvr.com/view/O8bauso0wrf",
        "https://samsungvr.com/view/OuYzVHKlEeT",
        "https://samsungvr.com/view/WCBx_30Oah8"
    ]
};