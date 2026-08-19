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
        "https://www.espn.com.ar/video/clip?id=16686351",
        "https://www.espn.com/video/clip/_/id/48638688",
        "https://www.espn.com/watch/player/_/id/49654032/country/us/redirected/true#bucketId=1",
        "https://www.espn.com/watch/player/_/id/7927216f-bca9-4fd8-8dcd-c128912e792c",
        "https://www.espn.ph/video/clip?id=49655248",
        "https://espndeportes.espn.com/video/clip/_/id/16801116",
        "https://espndeportes.espn.com/video/clip/_/id/16463837",
        "https://espndeportes.espn.com/video/clip/_/id/13326426",
    ]
};