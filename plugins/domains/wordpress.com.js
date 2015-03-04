module.exports = {

    mixins: [
        "oembed-author",
        "oembed-site",
        "oembed-title",
        "oembed-thumbnail",
        "oembed-author",
        "favicon"
    ],

    getLink: function(oembed, __readabilityEnabled) {

        return {
            html: oembed.html,
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.reader, CONFIG.R.inline] 
        }
    },


    tests: [{
        feed: "http://en.wordpress.com/tag/javascript/feed/",
        getUrl: function(url) {
            var m = url.match(/http:\/\/\w+\.wordpress\.com/i);
            if (m) {
                return url;
            }
        }
    }, {
        skipMixins: [
            "oembed-thumbnail"
        ]
    }]
};