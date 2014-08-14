module.exports = {

    mixins: [
        "og-title",
        "og-description",
        "oembed-site",
        "author",
        "copyright",

        "og-image",        
        "oembed-video-responsive-nonhtml5",
        "favicon"
    ],

    getMeta: function (url, oembed) {

        //oembed is param, but not used. It's a trick for fallback to generic parsers where there is no oEmbed. Otherwise mixins don't recognize it.
        // Besides, canonical was url-encoded and broken anyway.
        return {
            canonical: url
        }
    },

    tests: [ 
        "http://portal.sliderocket.com/SlideRocket-Presentations/Hoshyar-Foundation"
    ]
};