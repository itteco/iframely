export default {

    re: [
        /^(https?:\/\/art19\.com\/shows\/[a-zA-Z0-9\-_]+\/episodes\/[a-zA-Z0-9\-_]+)/i,
        /^(https?:\/\/art19\.com\/shows\/[a-zA-Z0-9\-_]+)/i        
    ],

    mixins: [
        "oembed-title",
        "oembed-description",
        "og-image",
        "oembed-site",
        "domain-icon",
        "oembed-iframe"
    ],

    getLink: function(iframe, options) {

        var params = Object.assign(iframe.query);

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
                label: CONFIG.L.theme,
                value: theme,
                values: {
                    light: CONFIG.L.light,
                    dark: CONFIG.L.dark
                }
            };
        } else {
            params.type = 'artwork';
            params.stretch = true;
            delete params.theme;
        }

        opts.horizontal = {
            label: CONFIG.L.horizontal,
            value: horizontal
        }

        return {
            href: iframe.assignQuerystring(params),
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.oembed], // keep rel oembed here - it prevents validators from removing embed srcz
            media: horizontal ? {height: iframe.height, scrolling: 'no'} : {'aspect-ratio': 1},
            scrolling: 'no',
            options: opts
        };
    },

    tests: [{
        noFeeds: true,
        skipMixins: [
            "twitter-image"
        ]
    },
        "https://art19.com/shows/intercom-on-product-management?ref=producthunt",
        "https://art19.com/shows/intercom-on-product-management/episodes/5801ff9e-51ba-4e15-a284-5069751c6bed"
    ]
};