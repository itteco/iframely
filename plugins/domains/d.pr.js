export default {

    re: [
        /^https?:\/\/(\w+\.)?d\.pr(?:\/free)?\/(?:i|v|)\//i
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
        } else if (/mp4/i.test(oembed.variant) &&
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
            return cb (/\/free\//i.test(url)
                ? {redirect: url.replace(/\/free\//i, '/')}
                : null);
        } else {
            return cb(null);
        }
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