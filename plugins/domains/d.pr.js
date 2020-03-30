module.exports = {

    re: [
        /^https?:\/\/(\w+\.)?d\.pr\/(?:i\/)?([a-zA-Z0-9]+)/i
    ],

    mixins: [
        "*"
    ],

    getLink: function(oembed, cheerio) {

        if ( /image|photo/.test(oembed.type) || /image/i.test(oembed.drop_type)) {
            return {
                href: oembed.url,
                type: CONFIG.T.image,
                rel: CONFIG.R.image
                // verify that image exists, omit sizes
                // width: oembed.width,
                // height: oembed.height
            };
        }
        if (/mp4/i.test(oembed.variant)) {
            var url = cheerio('video source').attr('src');
            if (url) {
                return {
                    href: url,
                    type: CONFIG.T.video_mp4,
                    rel: [CONFIG.R.player, CONFIG.R.html5]
                };
            }
        }
    },

    tests: [{
        noFeeds: true
    },
        "https://d.pr/i/9jB7",
        "https://d.pr/i/vO1p"
    ]
};