module.exports = {

    provides: '__allowRedbullVideo',

    mixins: [
        "*"
    ],

    getLink: function(__allowRedbullVideo, cheerio, url) {

        var selector = /\/stories\//.test(url) ? '.story__primary-media .video-js' : 'video.video-js' ;

        var $video = cheerio(selector);

        if ($video.length === 1) {

            var account = $video.attr('data-account');
            var player = $video.attr('data-player');
            var video_id = $video.attr('data-video-id');

            return {
                href: "https://sharevideo.redbull.com/vjs/index.html?r=1&cornerbug=true&origin=https://www.redbull.com&accid=" + account + "&pid=" + player + "&vid=" + video_id,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                'aspect-ratio': 560/315                
            }
        }
    },

    getData: function(twitter) {
        if (twitter.player) {
            return {
                __allowRedbullVideo: true
            };
        }
    },

    tests: [
        "http://www.redbull.com/uk/en/esports/stories/1331814022499/project-cars-tips-for-red-bull-5g?linkId=30936298",
        "https://www.redbull.com/ie/en/bike/stories/1331824443479/gee-atherton-pov-foxhunt-2016",
        "https://www.redbull.com/us/en/bike/stories/1331819230253/jump-onboard-kriss-kyle-s-wallride-road-trip",
        "http://www.redbull.com/en/adventure/stories/1331825478086/new-record-highest-base-jump-rozov",
        "http://www.redbull.com/en/bike/episodes/1331827190659/szymon-godziek-power-of-mind-episode-2"
    ]
};