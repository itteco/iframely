module.exports = {

    re: /^https?:\/\/www\.bravotv\.com\/([a-z0-9\-]+)\/([a-z0-9\-]+)\/videos\/([a-z0-9\-]+)/i,

    mixins: [
        "og-title",
        "og-image",
        "favicon"
    ],

// Get src "http://player.theplatform.com/p/PHSl-B/yT7k3t_YLXoZ/select/30PGw6rTJxLQ?fee…t-happens-live/season-10/videos/after-show-andy-gets-a-bar-mitzvah-present"
// Convert to "http://player.theplatform.com/p/PHSl-B/yT7k3t_YLXoZ/embed/select/30PGw6rTJxLQ"

    getLink: function($selector) {

        var videoFrame = $selector('#tp-global-player');

        if (videoFrame) {
            return {
                href: videoFrame.attr('src').replace('/select/', '/embed/select/').split('?')[0],
                type: CONFIG.T.text_html,
                rel: CONFIG.R.player,
                "aspect-ratio": videoFrame.attr('width') / videoFrame.attr('height')
            }
        }
    },

    tests: [{
        page: "http://www.bravotv.com/videos",
        selector: ".post .video a"
    }, {
        skipMixins: [
            "image_src",
            "description"
        ]
    }]
};