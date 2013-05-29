module.exports = {

    mixins: [
        "oembed-author",
        "oembed-site",
        "oembed-title",

        "oembed-thumbnail"
    ],

    getLinks: function(oembed) {

        var html = '<img src="' + oembed.thumbnail_url + '" /><br><br>' + oembed.html;

        return [

        // Logo.
        {
            "href": "http://app.qz.com/img/logo/quartz.svg",
            "type": CONFIG.T.image_svg,
            "rel": CONFIG.R.logo
        },

        // Favicon.
        {
            "href": "http://app.qz.com/img/icons/touch_72.png",
            "rel": [
                "apple-touch-icon-precomposed",
                CONFIG.R.icon
            ],
            "type": CONFIG.T.image_png,
            "width": 72,
            "height": 72
        },

        // Reader.
        {
            html: html,
            type: CONFIG.T.safe_html,
            rel: CONFIG.R.reader
        }];
    },

    tests: [{
        pageWithFeed: "http://qz.com/"
    },
        "http://qz.com/78935/amazon-enterprise-cloud-computing/"
    ]
};