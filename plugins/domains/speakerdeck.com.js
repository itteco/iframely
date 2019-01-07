var $ = require('cheerio');

module.exports = {

    mixins: [
        "oembed-title",
        "oembed-site",
        "oembed-author",
        "domain-icon",
        "og-description"     
    ],

    getLink: function (url, oembed) {
        var $container = $('<div>');
        try {
            $container.html(oembed.html);
        } catch(ex) {}

        var $iframe = $container.find('iframe');
        var doc; 

        if ($iframe.length == 1) {
            var href = $iframe.attr('src');
            if (/\?slide=\d+/i.test(url)) {
                href +=  href.indexOf('?') > -1 ? '&' : '?';
                href += url.match(/\?(slide=\d+)/i)[1];
            }
            doc = {
                href: href,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                "aspect-ratio": oembed.width / oembed.height 
            }
        }

        var thumbnail;

        if (doc) {
            var id = doc.href.match(/\/\/speakerdeck\.com\/player\/([a-z0-9\-]+)/i)[1];

            if (id) {
                thumbnail = {
                    href: 'https://speakerd.s3.amazonaws.com/presentations/' + id + '/slide_0.jpg',
                    type: CONFIG.T.image,
                    rel: [CONFIG.R.thumbnail]
                };
            }
        }

        return [doc, thumbnail];
    },


    tests: [
        "https://speakerdeck.com/gr2m/rails-girls-zurich-keynote?slide=3",
        "https://speakerdeck.com/lynnandtonic/art-the-web-and-tiny-ux"
    ]
};
