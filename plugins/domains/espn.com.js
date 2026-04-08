export default {

    re: [
        /^https?:\/\/((?:www\.)?espn\.com?(?:\.\w{2})?)\/video\/clip\?id=espn:(\d+)/i,
        /^https?:\/\/((?:www\.)?espn\.com?(?:\.\w{2})?)\/video\/clip\?id=(\d+)/i,
        /^https?:\/\/((?:www\.)?espn\.\w{2,3})\/video\/clip\?id=(\d+)/i,
        /^https?:\/\/((?:\w+\.)?espn\.com?(?:\.\w{2})?)\/video\/clip\/_\/id\/(\d+)/i,
        /^https?:\/\/((?:www\.)?espn\.com)\/watch\/player\/[^\/]+\/id\/(\d+)/i
    ],

    mixins: ["*"],

    getLink: function(urlMatch) {

        return {
            href: `https://${urlMatch[1]}/core/video/iframe/_/id/${urlMatch[2]}/endcard/false`,
            accept: CONFIG.T.text_html,
            rel: CONFIG.R.player,
            "aspect-ratio": 16/9
        };
    },

    tests: [{
        noFeeds: true
    },
        "https://www.espn.com/video/clip/_/id/18883925",
        "https://www.espn.com.ar/video/clip?id=10100188",
        "https://www.espn.com/video/clip/_/id/48428314",
        "https://www.espn.com/watch/player/_/id/27394219/country/us/redirected/true#bucketId=1",
        "https://www.espn.ph/video/clip?id=48351638",
        "https://espndeportes.espn.com/video/clip/_/id/15544320",
        "https://espndeportes.espn.com/video/clip/_/id/16463837",
        "https://espndeportes.espn.com/video/clip/_/id/13326426",
    ]
};