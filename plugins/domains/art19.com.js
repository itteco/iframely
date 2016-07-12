var $ = require('cheerio');

module.exports = {

    re: [
        /^(https?:\/\/art19\.com\/shows\/[a-zA-Z0-9\-_]+\/episodes\/[a-zA-Z0-9\-_]+)/i
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
            try{
                $container.html(oembed.html);
            } catch(ex) {}

            var $iframe = $container.find('iframe');

            if ($iframe.length == 1) {

                var player = $iframe.attr('src');
                var theme = options.getProviderOptions('art19.theme') || 'light-gray-blue';

                if (/theme=\w+/.test(player)) {
                    player.replace (/theme=\w+/, theme); 
                } else {
                    player += '?theme=' + theme;
                }

                return {
                    href: player,
                    type: CONFIG.T.text_html,
                    rel: [CONFIG.R.player, CONFIG.R.html5],
                    height: oembed.height,
                    scrolling: 'no'
                };
            }
        }
    },

    tests: [
        "https://art19.com/shows/fox-sports-live/episodes/4c924063-ca48-487c-ad93-b2b3485a267c",
        "https://art19.com/shows/the-audible/episodes/6cfafe96-16e8-44bc-8d18-6a69ff807c63"
    ]
};