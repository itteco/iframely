module.exports = {

    notPlugin:  !(CONFIG.providerOptions.readability && CONFIG.providerOptions.readability.enabled === true),

    mixins: [
        "oembed-author",
        "oembed-site",
        "oembed-title",

        "oembed-thumbnail"
    ],

    getLinks: function(oembed) {

        var html = oembed.html;

        if (oembed.thumbnail_url) {
            html = '<img src="' + oembed.thumbnail_url + '" /><br><br>' + html;
        }

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
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.reader, CONFIG.R.inline]
        }];
    },

    tests: [
        "http://qz.com/78935/amazon-enterprise-cloud-computing/", {
            skipMixins: [
                "oembed-thumbnail"
            ]
        }
    ]
};