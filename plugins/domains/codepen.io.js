var jquery = require('jquery');

module.exports = {

    re: /http:\/\/codepen\.io\/([a-z0-9\-]+)\/(pen|details)\/([a-z0-9\-]+)/i,

    mixins: [
        "oembed-thumbnail",
        "oembed-author",
        "oembed-site",
        "oembed-title"
    ],

    getLink: function(oembed) {

        var links = [{
            href: "http://codepen.io/favicon.ico",
            type: CONFIG.T.image_icon,
            rel: CONFIG.R.icon,
            width: 32,
            height: 32
        }];

        var $container = jquery('<div>');
        try{
            $container.html(oembed.html);
        } catch(ex) {}

        var $iframe = $container.find('iframe');

        if ($iframe.length == 1) {
            links.push({
                href: $iframe.attr('src'),
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.app, CONFIG.R.oembed],
                height: oembed.height
            });
        }

        return links;
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