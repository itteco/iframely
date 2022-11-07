export default {

    re: [
        /^https?:\/\/(?:www\.)?espn\.com?(?:\.\w{2})?\/video\/clip\?id=espn:(\d+)/i,
        /^https?:\/\/(?:www\.)?espn\.com?(?:\.\w{2})?\/video\/clip\?id=(\d+)/i,
        /^https?:\/\/(?:www\.)?secsports\.com\/video\/(\d+)/i,
        /^https?:\/\/(?:\w+\.)?espn\.com?(?:\.\w{2})?\/(?:videohub\/)?video\/clip\/_\/id\/(\d+)/i,
        /^https?:\/\/(?:www\.)?espn\.com\/watch\/player\/[^\/]+\/id\/(\d+)/i
    ],

    mixins: ["*"],

    getLink: function(urlMatch) {

        return {
            href: 'https://www.espn.com/core/video/iframe?id=' + urlMatch[1] + '&endcard=false',
            accept: CONFIG.T.text_html,
            rel: CONFIG.R.player,
            "aspect-ratio": 16/9
        };
    },

    tests: [{
        noFeeds: true
    },
        "http://www.secsports.com/video/17630059",
        "http://www.espn.com/video/clip/_/id/18883925",
        "https://www.espn.com.ar/video/clip?id=10100188",
        "http://www.espn.com/videohub/video/clip/_/id/18883925/categoryid/2378529",
        "https://www.espn.com/watch/player/_/id/27394219/country/us/redirected/true#bucketId=1",
        "https://espndeportes.espn.com/video/clip/_/id/10250538"
    ]
};