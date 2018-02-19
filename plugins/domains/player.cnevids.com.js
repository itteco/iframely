var $ = require('cheerio');

module.exports = {


    mixins: [
        "oembed-thumbnail",
        "oembed-author",
        "oembed-site",
        "oembed-title"
    ],

    getLink: function(oembed, whitelistRecord) {

        var $container = $('<div>');
        try {
            $container.html(oembed.html);
        } catch(ex) {}

        var $iframe = $container.find('iframe');

        if ($iframe.length == 1 && whitelistRecord.isAllowed && whitelistRecord.isAllowed('oembed.video')) {

            var href = $iframe.attr('src');

            return {
                href: href + (href.indexOf('?') > -1 ? '&' : '?') + 'autoplay=0',
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.oembed, CONFIG.R.html5],
                autoplay: "autoplay=1",
                'aspect-ratio': oembed.width / oembed.height
               
            };            
        }

    },

    tests: [
        "https://player.cnevids.com/embed/5670377e94c05f43e9000000/51097beb8ef9aff9f5000008"
    ]
};
