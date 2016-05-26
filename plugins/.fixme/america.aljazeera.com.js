module.exports = {

    re: [
        /^https?:\/\/america\.aljazeera\.com(\/watch\/shows\/[\/a-zA-Z0-9-]+)\.html$/i
    ],

    mixins: ["*"],

    getLink: function(urlMatch) {

        return {
                href: "http://america.aljazeera.com/watch/embed.html/content/ajam" + urlMatch[1],                
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                "aspect-ratio": 4 / 3
            };
    },

    tests: [
        "http://america.aljazeera.com/watch/shows/live-news/2015/12/the-arts-raising-awareness-of-human-rights-abuses.html"
    ]
};