module.exports = {

    re: /^(https:\/\/hbr\.org\/video\/)(\d+\/)([\w-]+)/i,

    mixins: [
        "*"
    ],    

    getLink: function(urlMatch) {
        return {
            href: urlMatch[1] + 'embed/' + urlMatch[2] + urlMatch[3],
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.html5],
            "aspect-ratio": 16/9
        };
    },

    tests: [
        "https://hbr.org/video/2371653503001/six-skills-middle-managers-need",
        "https://hbr.org/video/2363646218001/the-risk-and-reward-of-disagreeing-with-your-boss",
        "https://hbr.org/video/5397112037001/5-principles-for-innovation-in-emerging-markets?utm_source=dlvr.it&utm_medium=twitter"
    ]

};