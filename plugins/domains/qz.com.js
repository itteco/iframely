module.exports = {

    mixins: [
        "oembed-author",
        "oembed-site",
        "oembed-title",

        "oembed-thumbnail"
    ],

    getLinks: function(oembed) {

        var html = '<img src="' + oembed.thumbnail_url + '" /><br><br>' + oembed.html;

        return [{
            "href": "http://app.qz.com/img/logo/quartz.svg",
            "type": CONFIG.T.image_svg,
            "rel": [CONFIG.R.thumbnail, CONFIG.R.logo]
        }, {
            "href": "http://app.qz.com/img/icons/touch_144.png",
            "rel": ["apple-touch-icon-precomposed", CONFIG.R.icon],
            "type": CONFIG.T.image_png,
            "width": 144,
            "height": 144
        }, {
            "href": "http://app.qz.com/img/icons/touch_114.png",
            "rel": [
                "apple-touch-icon-precomposed",
                CONFIG.R.icon
            ],
            "type": CONFIG.T.image_png,
            "width": 114,
            "height": 114
        }, {
            "href": "http://app.qz.com/img/icons/touch_72.png",
            "rel": [
                "apple-touch-icon-precomposed",
                CONFIG.R.icon
            ],
            "type": CONFIG.T.image_png,
            "width": 72,
            "height": 72
        }, {
            html: html,
            type: CONFIG.T.safe_html,
            rel: CONFIG.R.reader
        }];
    }

};