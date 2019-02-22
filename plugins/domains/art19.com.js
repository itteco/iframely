var $ = require('cheerio');
const querystring = require('querystring');
const URL = require("url");

module.exports = {

    re: [
        /^(https?:\/\/art19\.com\/shows\/[a-zA-Z0-9\-_]+\/episodes\/[a-zA-Z0-9\-_]+)/i,
        /^(https?:\/\/art19\.com\/shows\/[a-zA-Z0-9\-_]+)/i        
    ],

    mixins: [
        "oembed-title",
        "oembed-description",
        "twitter-image",
        "oembed-site",
        "domain-icon"
    ],

    getLink: function(oembed, options) {

        if (oembed.html) {

            var $container = $('<div>');
            try {
                $container.html(oembed.html);
            } catch(ex) {}

            var $iframe = $container.find('iframe');

            if ($iframe.length == 1) {

                var player = $iframe.attr('src');
                var params = URL.parse(player, true).query;

                var theme = options.getRequestOptions('players.theme', 'light');
                params.theme = theme === 'light' ? 'light-gray-blue' : 'dark-blue';

                var opts = {};

                var horizontal = options.getRequestOptions('players.horizontal', true);

                if (horizontal) {
                    delete params.type;
                    delete params.stretch;

                    var theme = options.getRequestOptions('players.theme', 'light');                    
                    params.theme = theme === 'light' ? 'light-gray-blue' : 'dark-blue';

                    opts.theme = {
                        label: 'Theme color',
                        value: theme,
                        values: {
                            light: 'Light',
                            dark: 'Dark'
                        }
                    };
                } else {
                    params.type = 'artwork';
                    params.stretch = true;
                    delete params.theme;
                }

                opts.horizontal = {
                    label: 'Compact player with smaller artwork',
                    value: horizontal
                }

                return {
                    href: (/\?/.test(player) ? player.replace(/\?.+/, '?') : player + '?') + querystring.stringify(params),
                    type: CONFIG.T.text_html,
                    rel: [CONFIG.R.player, CONFIG.R.html5, CONFIG.R.oembed], // keep rel oembed here - it prevents validators from removing embed srcz
                    media: horizontal ? {height: oembed.height} : {'aspect-ratio': 1},
                    scrolling: 'no',
                    options: opts
                };
            }
        }
    },

    tests: [{
        noFeeds: true,
        skipMixins: [
            "twitter-image"
        ]
    },
        "https://art19.com/shows/fox-sports-live/episodes/4c924063-ca48-487c-ad93-b2b3485a267c",
        "https://art19.com/shows/the-audible/episodes/ba9724d3-8a79-4e8f-a5dd-0f816f217e50/embed?theme=light-gray-blue",
        "https://art19.com/shows/skip-and-shannon-undisputed/embed"
    ]
};