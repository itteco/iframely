module.exports = {

    re: [
        /^https?:\/\/(?:www\.)?espn\.com\/video\/clip\?id=espn:(\d+)/i,
        /^https?:\/\/(?:www\.)?espn\.com\/video\/clip\?id=(\d+)/i,
        /^https?:\/\/xgames\.espn\.com\/xgames\/video\/(\d+)\//i,
        /^https?:\/\/(?:www\.)?secsports\.com\/video\/(\d+)/i,
        /^https?:\/\/(?:www\.)?espn\.com\/(?:videohub\/)?video\/clip\/_\/id\/(\d+)/i        
    ],

    mixins: ["*"],

    getLink: function(urlMatch) {

        return {
            href: 'http://www.espn.com/core/video/iframe?id=' + urlMatch[1] + '&endcard=false',
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.html5],
            "aspect-ratio": 16/9
        };
    },

    tests: [{
        noFeeds: true
    },
        "http://www.espn.com/video/clip?id=espn:14780138",
        "http://espn.go.com/video/clip?id=13328484",
        "http://xgames.espn.com/xgames/video/13380522/real-moto-drake-mcelroy",
        "http://www.secsports.com/video/17630059",
        "http://www.espn.com/video/clip/_/id/18883925",
        "http://www.espn.com/videohub/video/clip/_/id/18883925/categoryid/2378529"
    ]
};