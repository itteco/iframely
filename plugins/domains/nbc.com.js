module.exports = {

    mixins: [
        "*"
    ],

    getLink: function(twitter) {

        if (twitter.player && twitter.player.value && !/\/onsite_universal\//i.test(twitter.player.value)) { // avoid "this video is not allowed on this domain"        

            return {
                href: twitter.player.value,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                "aspect-ratio": twitter.player.width > twitter.player.height ? twitter.player.width / twitter.player.height : twitter.player.height / twitter.player.width
                // yep, width and height can be mixed
            }
        }
    },

    tests: [
        "https://www.nbc.com/the-tonight-show/video/alex-rodriguez-clears-up-his-animosity-toward-jimmy/2928739",
        // "http://www.nbc.com/saturday-night-live/video/hotline-bling-parody/2933534", // not allowed
    ]
};