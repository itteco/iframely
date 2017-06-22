module.exports = {

    re: /^https?:\/\/bigthink\.com\/videos\/([a-zA-Z0-9\-]+)/i,

    mixins: [
        "*"
    ],

    getLink: function(urlMatch) {
        return {
            href: "http://bigthink.com/embeds/video_idea/" + urlMatch[1],
            rel: [CONFIG.R.player, CONFIG.R.html5],
            type: CONFIG.T.text_html,
            'aspect-ratio': 16 / 9
        };
    },

    tests: [{
        page: "http://bigthink.com/videos",
        selector: "#video_ideas_index .headline a"
    },
        "http://bigthink.com/videos/bre-pettis-on-makerbot-3-d-printing",
        "http://bigthink.com/videos/vivek-wadhwa-every-industry-will-be-disrupted"
    ]
};