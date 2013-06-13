module.exports = {

    re: [
        /^http:\/\/techcrunch\.com\/([0-9]+)\/([0-9]+)\/([0-9\-]+)/i
    ],

    mixins: [
        "oembed-author",
        "oembed-site",
        "oembed-title",

        "oembed-thumbnail"
    ],

    getLinks: function() {

        return [

        // Logo.
        {
            href: "//tctechcrunch2011.files.wordpress.com/2011/11/techcrunch_transparent.png",
            type: CONFIG.T.image,
            rel: CONFIG.R.logo
        },

        // Favicon.
        {
            href: "//s2.wp.com/wp-content/themes/vip/tctechcrunch2/images/favicon.ico?m=1357660109g",
            rel: CONFIG.R.icon,
            type: CONFIG.T.image_png,
            width: 72,
            height: 72
        }];
    },

    getData: function($selector) {

        var $html = $selector('div.body-copy')

        if ($html.length) {

            var html = '';

            html += $html.html();

            return {
                html_for_readability: html,
                ignore_readability_error: true
            }
        }
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