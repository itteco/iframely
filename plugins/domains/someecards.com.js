module.exports = {

    mixins: [
        "og-title",
        "og-site",
        "canonical",
        "favicon"
    ],

    getLink: function (meta) {
        if (meta.twitter && meta.twitter.image)
            return {
                href: meta.twitter.image.url,
                type: CONFIG.T.image,
                rel: [CONFIG.R.image],
                width: meta.twitter.image.width,
                height: meta.twitter.image.height
            }

        if (meta.image_src)
            return {
                href: meta.image_src,
                type: CONFIG.t.image,
                rel: [CONGIG.R.image],
            }            
    },

    tests: [
        "http://www.someecards.com/usercards/viewcard/eea3c10dfaeb6ef8c6eb386707343c36"
    ]
};
