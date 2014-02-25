module.exports = {

    notPlugin:  !(CONFIG.providerOptions.readability && CONFIG.providerOptions.readability.enabled === true),

    re: [
        /^http:\/\/techcrunch\.com\/([0-9]+)\/([0-9]+)\/([0-9\-]+)/i
    ],

    mixins: [
        "oembed-author",
        "oembed-site",
        "oembed-title",

        "twitter-image"
    ],
    
    getMeta: function(urlMatch) {
        if (urlMatch.size < 4) return;

        return {
            date: urlMatch[1] + '-' + urlMatch[2] + '-' + urlMatch[3]
        }
    },

    getLinks: function(cheerio) {

        var links = [];
        var $html = cheerio('div.article-entry')

        if ($html.length) {

            var html = '';

            html += $html.html();

            links.push ({
                html: html,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.reader, CONFIG.R.inline]
            });
        }

        links.push ({
            // Logo.
            href: "//tctechcrunch2011.files.wordpress.com/2011/11/techcrunch_transparent.png",
            type: CONFIG.T.image,
            rel: CONFIG.R.logo
        });

        links.push ({
            // Favicon.
            href: "//s2.wp.com/wp-content/themes/vip/tctechcrunch2/images/favicon.ico?m=1357660109g",
            rel: CONFIG.R.icon,
            type: CONFIG.T.image_png,
            width: 72,
            height: 72
        });

        return links;
    },

    tests: [{
        pageWithFeed: "http://techcrunch.com/"
    },
        "http://techcrunch.com/2013/05/31/amazon-updates-route-53-dns-service-to-make-hosting-high-availability-sites-on-ec2-easier/",
        {
            skipMixins: [
                "oembed-thumbnail"
            ]
        }
    ]
};