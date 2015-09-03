module.exports = {

    mixins: [
        "oembed-title",
        "oembed-description",
        "oembed-author",
        "oembed-site",
        "oembed-thumbnail",
        "oembed-video-responsive"
    ],

    getLink: function(oembed) {

        // require oembed so that plugin falls back to generic when required
        
        return {
            href: 'https://d2yc83ilop69kq.cloudfront.net/images/icons/touchicon-72-d0854f51a6.png',
            type: CONFIG.T.image,
            rel: CONFIG.R.icon
            // no sizes so that Iframely checks that icon still exists
        }
    },

    tests: [
        "http://animoto.com/play/k01h0yvqf59whdd80nla1q",
        {
            skipMixins: [
                "oembed-thumbnail",
                "oembed-author"
            ]
        }
    ]
};