module.exports = {

    // used for hosted simplecasts
    re: [
        /^https?:\/\/simplecast\.com\/(?:card|s|e)\/([a-zA-Z0-9\-]+)/i,
        /^https?:\/\/[a-zA-Z0-9\-_]+\.simplecast\.com\/episodes\/[a-zA-Z0-9\-]+\-([a-zA-Z0-9]+)\/?(?:\?[^\?]+)?$/i,        
        /^https?:\/\/embed\.simplecast\.com\/([a-zA-Z0-9\-]+)/i        
    ],

    mixins: ["*"],

    getLink: function(urlMatch, options) {

        // https://help.simplecast.com/getting-started/how-to-share-your-episodes-on-social-media-and-your-website
        // old: https://medium.com/@simplecast/new-embed-players-f0e07d685898
        var theme = options.getRequestOptions('players.theme', 'light');
        var horizontal = options.getRequestOptions('players.horizontal', false);

        var href = horizontal && theme !== 'dark'
            ? "https://simplecast.com/card/" + urlMatch[1]
            : "https://embed.simplecast.com/" + urlMatch[1] + (theme === 'dark' ? '?color=3d3d3d' : '');

        var opts = {
            theme: {
                label: CONFIG.L.theme,
                value: theme,
                values: {
                    dark: CONFIG.L.dark,
                    light: CONFIG.L.light
                }
            },
            horizontal: {
                label: CONFIG.L.horizontal,
                value: horizontal
            }
        }

        if (theme === 'dark') {
            delete opts.horizontal; // not reliable :(
        }

        return {
            href: href,
            accept: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.html5, CONFIG.R.oembed],
            height: horizontal && theme !== 'dark' ? 94 : 200,
            options: opts
        };
    },

    tests: [
        "https://simplecast.com/card/6e203f4f?color=3d3d3d",
        "https://embed.simplecast.com/c68f4e5d",
        "https://simplecast.com/e/bf974d38?style=medium-dark",
        "https://emitblackwell.simplecast.com/episodes/s3e14-the-rattlesnake-lawyer-johnathan-07ffb945"
        /*
        http://bikeshed.fm/54
        http://bikeshed.fm/57
        http://podcast.emojiwrap.com/episodes/53140-4-but-some-people-hated-the-blob
        https://objectsharp.com/podcast/cosmos-db-everything-you-wanted-to-know-about-microsoft-azures-nosql-offering-in-about-30-minutes/
        http://podcast.thegadgetflow.com/mark-campbell-inventurex
        */        
    ]
};