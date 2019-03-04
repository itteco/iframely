module.exports = {

    // used for hosted simplecasts
    re: [
        /^https?:\/\/simplecast\.com\/(?:card|s)\/([a-zA-Z0-9\-]+)/i,
        /^https?:\/\/embed\.simplecast\.com\/([a-zA-Z0-9\-]+)/i        
    ],

    mixins: ["*"],

    getLink: function(urlMatch, options) {

        // https://help.simplecast.com/getting-started/how-to-share-your-episodes-on-social-media-and-your-website
        var theme = options.getRequestOptions('players.theme', 'light');

        return {
            href: "https://embed.simplecast.com/" + urlMatch[1] + '?color=' + (theme === 'dark' ? '3d3d3d' : 'F5F5F5'),
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.html5],
            height: 200,
            options: {
                theme: {
                    value: theme,
                    values: {
                        dark: "Dark theme"
                    }
                }
            }
        };
    },

    tests: [
        "https://simplecast.com/card/6e203f4f?color=3d3d3d",
        "https://embed.simplecast.com/c68f4e5d"
        /*
        http://bikeshed.fm/54
        http://bikeshed.fm/57
        http://podcast.emojiwrap.com/episodes/53140-4-but-some-people-hated-the-blob
        https://objectsharp.com/podcast/cosmos-db-everything-you-wanted-to-know-about-microsoft-azures-nosql-offering-in-about-30-minutes/
        http://podcast.thegadgetflow.com/mark-campbell-inventurex
        */        
    ]
};