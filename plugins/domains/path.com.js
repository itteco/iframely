module.exports = {

    provides: 'getpath',

    re: [
        /^https?:\/\/path\.com\/p\/(\w+)/i,
        /^https?:\/\/path\.com\/moment\/(\w+)/i
    ],

    mixins: [
        "canonical",
        "og-title",
        "twitter-image",
        "favicon"
    ],

    getLink: function(getpath, meta) {

        if (getpath === "video") {
            return [
            /* broken as [object Object] atm
            {
                href: meta.og.video.url,
                type: meta.og.video.type,
                rel: [CONFIG.R.player, CONFIG.R.og],
                width: meta.og.video.width,
                height: meta.og.video.height
            },*/
            {
                href: meta.og.video.secure_url,
                type: meta.og.video.type,
                rel: [CONFIG.R.player, CONFIG.R.og],
                width: meta.og.video.width,
                height: meta.og.video.height
            }, {
                href: meta.og.image.url,
                type: CONFIG.T.image,
                rel: [CONFIG.R.thumbnail, CONFIG.R.twitter],
                width: meta.og.image.width,
                height: meta.og.image.height
            }];
        } // otherwise falls back to default parser for twitter-image
    },

    getData: function (meta) {

        if (meta.og.type === "getpath:video_moment") {
            return {
                getpath: "video"
            }
        }
    },

    tests: [ 
        "https://path.com/p/42Sun1",
        "https://path.com/p/2Citrk",
        "https://path.com/p/2XzZcC",
        "https://path.com/p/12tHdu",
        "https://path.com/p/2QsP9k"
    ]
};