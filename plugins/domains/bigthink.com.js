module.exports = {

    re: /^https?:\/\/bigthink\.com\/videos\/([a-zA-Z0-9\-]+)/i,

    mixins: [
        "*"
    ],

    getData: function(cheerio, cb) {
        var $el = cheerio('.widget__video script');

        var $container = cheerio('<div>');
        try {
            $container.html($el.text());
        } catch (ex) {}

        var $iframe = $container.find('iframe');

        if (/jwplayer_video_url=/.test($iframe.attr('src'))) {
            cb (null, {
                __promoUri: {url: decodeURIComponent($iframe.attr('src').match(/jwplayer_video_url=([^&]+)/i)[1]).replace(/\.js$/, '.html')}
            });
        } else {
            cb(null);
        }
    },

    tests: [{
        page: "http://bigthink.com/videos",
        selector: ".trending-posts a.custom-post-headline"
    },
        "http://bigthink.com/videos/bre-pettis-on-makerbot-3-d-printing",
        "http://bigthink.com/videos/vivek-wadhwa-every-industry-will-be-disrupted"
    ]
};