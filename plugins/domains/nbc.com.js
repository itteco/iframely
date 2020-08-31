var URL = require("url");

module.exports = {

    mixins: [
        "*"
    ],

    getData: function(twitter, og) {

        var video_src = (twitter.player && twitter.player.value);

        if (!video_src && og.video && og.video.secure_url) {

            var secure_url = URL.parse(og.video.secure_url, true);
            video_src = secure_url.query && secure_url.query.v && secure_url.query.v.replace(/\/widget\/config\/select\//i,'/widget/select/');
        }

        if (video_src && !/\/onsite_universal\//i.test(video_src)) { // avoid "this video is not allowed on this domain"        

            return {
                __promoUri: {url: video_src.replace(/^\/\//, 'https://')}
            }
        }
    },

    tests: [
        "https://www.nbc.com/the-tonight-show/video/alex-rodriguez-clears-up-his-animosity-toward-jimmy/2928739",
        "http://www.nbc.com/saturday-night-live/video/hotline-bling-parody/2933534", // geo resrticted
    ]
};