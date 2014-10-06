var jquery = require('jquery');

module.exports = {

    mixins: [
        "oembed-title",
        "oembed-site",
        "oembed-author",
        "oembed-description"
    ],

    getLink: function(oembed) {

        var $container = jquery('<div>');
        try {
            $container.html(oembed.html);
        } catch(ex) {}

        var $iframe = $container.find('iframe');
        var player, thumbnail, autoplay;

        if ($iframe.length == 1) {
            player = {
                href: $iframe.attr('src'),
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                height: oembed.height,
                "min-width": oembed.width
            };

            autoplay = {
                href: $iframe.attr('src') + '&auto_play=true',
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5, CONFIG.R.autoplay],
                height: oembed.height,
                "min-width": oembed.width
            };            
        }

        if (oembed.thumbnail_url) {
            thumbnail = {
                href: oembed.thumbnail_url.replace('http:',''),
                type: CONFIG.T.image,
                rel: [CONFIG.R.thumbnail, CONFIG.R.oembed],
                width: oembed.thumbnail_width,
                height: oembed.thumbnail_height
            }
        }

        return [
            player, thumbnail, autoplay, 
            {
                href: '//a1.sndcdn.com/images/soundcloud_app.png?9d68d37',
                type: CONFIG.T.image,
                rel: CONFIG.R.icon
            }
        ];
    },

    tests: [
        "https://soundcloud.com/louislaroche/kate-bush-running-up-that-hill-llr-remix-full",
        "https://soundcloud.com/posij/sets/posij-28-hz-ep-division",
        {
            skipMixins: [
                "oembed-description"
            ]
        }
    ]
};
