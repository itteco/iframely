module.exports = {

    re: [
        /^https?:\/\/www\.nbcnews\.com\/(?:[a-z\-]+\/)?videos?\/[a-zA-Z0-9-]+\-(\d+)/i,
        /^https?:\/\/www\.nbcnews\.com\/widget\/video-embed\/(\d+)/i
    ],

    mixins: [
        "*"
    ],

    getMeta: function (urlMatch) {

        return {
            media: "player"
        }

    },

    getLink: function(urlMatch) {


        return {
            href: 'http://www.nbcnews.com/widget/video-embed/' + urlMatch[1],
            rel: [CONFIG.R.player, CONFIG.R.html5],
            type: CONFIG.T.text_html, 
            "aspect-ratio": 16/9,
            scrolling: 'no'
        };
    },

    tests: [
        "http://www.nbcnews.com/video/obama-america-is-not-as-divided-as-some-suggest-721895491854",
        "http://www.nbcnews.com/video/watch-live-president-obama-speaks-from-new-york-768509507658",
        "http://www.nbcnews.com/nightly-news/video/wife-s-video-shows-deadly-encounter-between-keith-scott-and-police-772184131883"
    ]
};