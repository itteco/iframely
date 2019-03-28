module.exports = {

    re: [
        /^https?:\/\/www\.nbcnews\.com\/(?:[a-z\-]+\/)?videos?\/[a-zA-Z0-9-]+\-(\d+)/i        
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
            href: 'https://www.nbcnews.com/widget/video-embed/' + urlMatch[1],
            rel: [CONFIG.R.player, CONFIG.R.html5],
            accept: CONFIG.T.text_html, // make sure it doesn't 404 
                                            // as in http://www.nbcnews.com/video/watch-live-obama-holds-final-press-conference-as-president-857386563735
            "aspect-ratio": 16/9,
            scrolling: 'no'
        };
    },

    tests: [
        "https://www.nbcnews.com/video/obama-america-is-not-as-divided-as-some-suggest-721895491854",
        "https://www.nbcnews.com/nightly-news/video/wife-s-video-shows-deadly-encounter-between-keith-scott-and-police-772184131883"
    ]
};