var jquery = require('jquery');

module.exports = {

    mixins: [
        "oembed-title",
        "oembed-author",
        "oembed-site",
        "canonical"
    ],

    getMeta: function(meta) {

        if (!meta.slideshare) {
            return;
        }

        return {
            category: meta.slideshare.category,
            date: meta.slideshare.published,
            views: meta.slideshare.view_count
        };
    },

    getLink: function(oembed) {

        var $container = jquery('<div>');
        try {
            $container.html(oembed.html);
        } catch(ex) {}

        var $iframe = $container.find('iframe');
        var doc; 

        if ($iframe.length == 1) {
            doc = {
                href: $iframe.attr('src').replace('http:', ''),
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player],
                "aspect-ratio": oembed.width / oembed.height // 4:3 + 35px for nav bar :(
                                                             // Would need to host embed as js file to address this.
            };
        }

        return [
            doc,
            {
                href: '//public.slidesharecdn.com/images/favicon.ico',
                type: CONFIG.T.image,
                rel: CONFIG.R.icon

            }, {
                href: oembed.thumbnail,
                type: CONFIG.T.image,
                rel: [CONFIG.R.thumbnail, CONFIG.R.oembed],
                width: oembed.thumbnail_width,
                height: oembed.thumbnail_height
            }
        ];
    },

    tests: [{
        pageWithFeed: "http://www.slideshare.net"
    },
        "http://www.slideshare.net/geniusworks/gamechangers-the-next-generation-of-business-innovation-by-peter-fisk#btnNext",
        {
            skipMethods: [
                "getMeta"
            ]
        }
    ]
};