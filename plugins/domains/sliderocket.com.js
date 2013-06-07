module.exports = {

    mixins: [
        "canonical",
        "og-title",
        "og-description",
        "oembed-site",
        "author",
        "copyright",

        "og-image",        
        "oembed-video-responsive",
        "favicon"
    ],

    tests: [ {
        page: "http://www.sliderocket.com/gallery/",
        selector: ".target-link"
    },
        "http://portal.sliderocket.com/SlideRocket-Presentations/Hoshyar-Foundation"
    ]
};