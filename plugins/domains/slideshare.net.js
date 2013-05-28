var jquery = require('jquery');

module.exports = {

    mixins: [
        "oembed-title",
        "oembed-author",
        "oembed-site",
        "canonical"
    ],

    getMeta: function(meta) {
        return {
            category: meta.slideshare.category,
            date: meta.slideshare.published,
            views: meta.slideshare.view_count
        };
    },

    getLink: function(meta, oembed) {

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
                rel: [CONFIG.R.reader],
                "aspect-ratio": oembed.width / oembed.height // 4:3 + 35px for nav bar :(
                                                             // Would need to host embed as js file to address this.
            }
        }

        return [doc, {
                href: '//public.slidesharecdn.com/images/favicon.ico',
                type: CONFIG.T.image,
                rel: [CONFIG.R.icon],
        }, {
                href: meta.twitter.image,
                type: CONFIG.T.image,
                rel: [CONFIG.R.thumbnail, CONFIG.R.twitter],
        }, {
                href: meta.og.image.replace('http:', ''),
                type: CONFIG.T.image,
                rel: [CONFIG.R.thumbnail, CONFIG.R.og],
        }]
    },

    tests: [
        "http://www.slideshare.net/geniusworks/gamechangers-the-next-generation-of-business-innovation-by-peter-fisk#btnNext"
    ]
};