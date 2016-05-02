var $ = require('cheerio');

module.exports = {

    re: /https?:\/\/codepen\.io\/([a-z0-9\-]+)\/(pen|details|full)\/([a-z0-9\-]+)/i,

    mixins: [
        "oembed-thumbnail",
        "oembed-author",
        "oembed-site",
        "oembed-title",
        "description",        
        "domain-icon"
    ],

    getLink: function(oembed, urlMatch) {

        if (urlMatch[1] === 'anon') {
            return { // Anonymous Pens can't be embedded
                    // return icon to avoid fallback to generic (whitelisted) parser
                href: 'http://codepen.io/logo-pin.svg',
                type: CONFIG.T.icon,
                rel: CONFIG.R.icon
            }
        }

        var $container = $('<div>');
        try{
            $container.html(oembed.html);
        } catch(ex) {}

        var $iframe = $container.find('iframe');

        if ($iframe.length == 1) {
            return {
                href: $iframe.attr('src'),
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.app, CONFIG.R.oembed, CONFIG.R.html5],
                height: oembed.height
            };
        }
    },

    tests: [ {
        pageWithFeed: "http://codepen.io/popular/",
        selector: ".cover-link"
    },
        "http://codepen.io/kevinjannis/pen/pyuix",
        "http://codepen.io/nosecreek/details/sprDl",
        "http://codepen.io/dudleystorey/pen/HrFBx"
    ]

};
