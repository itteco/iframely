module.exports = {

    re: [
        /^https?:\/\/path\.com\/p\/(\w+)/i,
        /^https?:\/\/path\.com\/moment\/(\w+)/i
    ],

    mixins: [
        "canonical",
        "favicon"
    ],

    getMeta: function(meta) {

        return {
            title: meta.getpath.caption || meta.getpath.thought || meta.og.description || meta.twitter.title + ' ' + meta.twitter.description,
            author: meta.twitter.title
        }
    },

    getLink: function(meta) {

        var moment_type = meta.og.type;

        if (moment_type !== "getpath:video_moment" && moment_type !== "getpath:photo_moment") {
            return;
        }

        if (moment_type == "getpath:video_moment") {
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
        } else {
            return {
                href: meta.twitter.image.url,
                type: CONFIG.T.image,
                rel: [CONFIG.R.image, CONFIG.R.twitter],
                width: meta.twitter.image.width,
                height: meta.twitter.image.height
            };
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