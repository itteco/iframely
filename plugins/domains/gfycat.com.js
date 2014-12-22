module.exports = {

    mixins: [
        "favicon",
        "keywords",
        "twitter-title",
        "twitter-description",
        "twitter-image"
    ],

    getLink: function(twitter) {

        var stream = twitter.player.stream;
        if (!(stream instanceof Array)) {
            stream = [stream];
        }

        var href;
        stream.forEach(function(item) {
            var url = item.value || item;
            if (typeof url === 'string' && url.match(/\.mp4$/)) {
                href = url;
            }
        });

        return {
            href: href,
            type: CONFIG.T.video_mp4,
            rel: [CONFIG.R.player, CONFIG.R.gifv],
            width: twitter.player.width,
            height: twitter.player.height
        };
    },

    tests: [{
        page: "http://www.reddit.com/r/gfycats",
        selector: "a.title"
    },
        "http://gfycat.com/DismalUnacceptableErne"
    ]
};