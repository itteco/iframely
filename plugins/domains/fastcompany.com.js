module.exports = {

    re: [
        /^https?:\/\/(www|m)\.fast(company|colabs|cocreate|codesign|coexist)\.com\/\d+\//i
    ],    

    mixins: [
        "*"
    ],

    getLink: function(twitter) {

        if (twitter.player && twitter.player.value && /^https?:\/\/(www\.)?fastcompany\.com\/embed\/\w+\/?$/i.test(twitter.player.value)) {
                
            return {
                href: twitter.player.value,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                type: CONFIG.T.text_html,
                "aspect-ratio": twitter.player.width / twitter.player.height,
                scrolling: 'no'
            }
        }
    },

    tests: [
        "http://www.fastcolabs.com/3018374/can-wearable-computers-revolutionize-how-we-learn-to-code",
        "http://m.fastcompany.com/1677370/actress-felicia-day-reroutes-her-career-web-series-guild",
        "http://www.fastcocreate.com/3016916/creation-stories/ricky-gervais-tells-a-story-about-how-he-learned-to-write",
        "http://www.fastcodesign.com/3062335/the-worlds-ugliest-color-examined-by-graphic-design-experts",
        "http://www.fastcoexist.com/3033651/watch-strausss-blue-danube-recreated-using-the-sound-of-wind-turbines"
        // broken: 
        // http://www.fastcompany.com/3029950/the-recommender/a-drone-takes-you-inside-the-ghost-town-abandoned-after-the-fukushima-nuclea
        // http://www.fastcodesign.com/3033587/watch-how-adobe-illustrator-changed-graphic-design?utm_source=facebook
    ]
};