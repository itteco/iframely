var $ = require('cheerio');

// TODO: support gallery: http://hyderphoto.smugmug.com/Daily-Photos/Daily-Photos/27429648_7XP8jg#!i=4106742422&k=zsmTVn9

module.exports = {

    mixins: [
        "*"
    ],

    highestPriority: true, 

    getMeta: function (oembed) {

        return {
            media: 'player'
        }

    },

    getLink: function (oembed) {

        var links = [];

        if (oembed.type === "photo") {

            var size_M_src = oembed.url;
            var size_X_src = size_M_src.replace("/M/", "/X3/");

            //thumbnail
            links.push({
                href: size_M_src,
                type: CONFIG.T.image,
                rel: CONFIG.R.thumbnail,
                width: oembed.width,
                height: oembed.height
            });

            //photo
            links.push({
                href: size_X_src,
                type: CONFIG.T.image,
                rel: CONFIG.R.image
            });

        } else if (oembed.type === "rich") {
            // iframe'd gallery

            var $container = $('<div>');

            try {
                $container.html(oembed.html);
            } catch(ex) {}

            var $iframe = $container.find('iframe');

            if ($iframe.length == 1) {
                links.push({
                    href: $iframe.attr('src').replace(/^http:\/\//, '//') + "?width=100%&height=100%",
                    type: CONFIG.T.text_html,
                    rel: [CONFIG.R.player, CONFIG.R.oembed]
                });
            }

        } // else it's oembed link with no thumnbnail or other useful info.
        
        return links;
    },

    tests: [{
        pageWithFeed: "http://www.smugmug.com/popular/today",
        getUrl: function(url) {
            return url.indexOf('smugmug.com/') > -1 ? url : null;
        },
        skipMethods: ["getLink"]
    },
        "http://www.smugmug.com/popular/all#!i=789708429&k=sPdffjw",
        "http://cedricwalter.smugmug.com/Computers/Joomla/i-726WRdK/A"
    ]
};