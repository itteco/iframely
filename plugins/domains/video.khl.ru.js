module.exports = {

    mixins: [
        "*"
    ],

    getLink: function(og, meta) {

        if (og.video && og.video.secure_url && /^https?:https?:\/\//i.test(og.video.secure_url)) { // for events, og.video.url is not reliable

            return {
                href: og.video.secure_url.replace(/^https?:https?:\/\//i, '//'),
                type: CONFIG.T.flash,
                rel: [CONFIG.R.player],
                // "aspect-ratio": use default
                autoplay: "autostart=1"
            } 
        }
    },

    tests: [
        "http://video.khl.ru/quotes/372979",
        "http://video.khl.ru/events/459559",
    ]
};