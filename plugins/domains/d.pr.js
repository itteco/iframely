module.exports = {

    re: [
        /^https?:\/\/(\w+\.)?d\.pr\/(?:i|v|free)\//i
    ],

    mixins: [
        "*"
    ],

    getLink: function(oembed, og) {

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
        if (/mp4/i.test(oembed.variant) &&
            og.video &&
            og.video.url
        ) {
            return {
                href: og.video.url,
                accept: CONFIG.T.video_mp4,
                rel: CONFIG.R.player
            };
        }
    },

    getData: function(url, cb, options) {
        if (!options.redirectsHistory || options.redirectsHistory.indexOf(url) === -1) {
            cb (/\/free\//i.test(url)
                ? {redirect: url.replace(/\/free\//i, '/')}
                : null);
        }
        cb(null);
    },

    tests: [{
        noFeeds: true,
        skipMethods: ['getData']
    },
        "https://d.pr/i/9jB7",
        "https://d.pr/i/vO1p",
        "https://d.pr/free/v/MU6bHj"
    ]
};