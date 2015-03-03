module.exports = {

    re: /^(https:\/\/hbr\.org\/video\/)(\d+\/)([\w-]+)$/i,

    mixins: [
        "og-video",
        "twitter-player",
        "og-image",
        "favicon",
        "og-description",
        "og-video-duration",
        "twitter-site",
        "twitter-title"
    ],    

    getLink: function(urlMatch) {
        return {
            href: urlMatch[1] + 'embed/' + urlMatch[2] + urlMatch[3],
            type: CONFIG.T.text_html,
            rel: CONFIG.R.player,
            "aspect-ratio": 16/9
        };
    },

    tests: [
        "https://hbr.org/video/2371653503001/six-skills-middle-managers-need",
        "https://hbr.org/video/2363646218001/the-risk-and-reward-of-disagreeing-with-your-boss"
    ]

};