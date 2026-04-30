export default {

    re: /^https?:\/\/(?:www\.)?thoughtsandprayersthegame\.com\/?$/i,

    mixins: [
        "*"
    ],

    getLink: function() {
        return {
            href: "https://thoughtsandprayersthegame.com/embed.html",
            rel: [CONFIG.R.app, CONFIG.R.iframely],
            type: CONFIG.T.text_html,
            "aspect-ratio": 16/9
        };
    },

    tests: [{noFeeds: true}, {skipMethods: ['getData']},
        "https://thoughtsandprayersthegame.com/",
        "https://thoughtsandprayersthegame.com",
        "https://www.thoughtsandprayersthegame.com/"
    ]

};
