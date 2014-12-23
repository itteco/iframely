module.exports = {

    re: /^(https:\/\/hbr\.org\/video\/)(\d+\/)([\w-]+)$/i,

    getMeta: function(urlMatch) {
        var title = urlMatch[3].replace(/-/g, ' ');
        title = title.substr(0, 1).toUpperCase() + title.substr(1);
        return {
            title: title
        };
    },

    getLinks: function(urlMatch) {
        return [{
            href: urlMatch[1] + 'embed/' + urlMatch[2] + urlMatch[3],
            type: CONFIG.T.text_html,
            rel: CONFIG.R.player,
            "aspect-ratio": 16/9
        }, {
            href: 'https://hbr.org/resources/images/favicon.ico',
            type: CONFIG.T.icon,
            rel: CONFIG.R.icon
        }];
    },

    tests: [
        "https://hbr.org/video/2371653503001/six-skills-middle-managers-need",
        "https://hbr.org/video/2363646218001/the-risk-and-reward-of-disagreeing-with-your-boss"
    ]

};