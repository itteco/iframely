module.exports = {

    re: /^https:\/\/www\.washingtonpost\.com\/(?:video|posttv)\/\w+\/[a-z0-9-]+\/\d+\/\d+\/\d+\/([a-z0-9-]+)_video\.html/i,

    mixins: [
        "*"
    ],

    getLink: function(urlMatch) {

        return {
            href: 'https://www.washingtonpost.com/video/c/embed/' + urlMatch[1],
            accept: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.html5],
            "aspect-ratio": 16 / 9,
            scrolling: 'no',
            autoplay: "autoplay=1"
        };
    },

    tests: [{
        noFeeds: true
    },
        "https://www.washingtonpost.com/video/world/the-uk-just-voted-to-leave-the-eu-heres-what-that-means/2016/06/24/df857508-38b6-11e6-af02-1df55f0c77ff_video.html",
        "https://www.washingtonpost.com/video/national/michael-gove-whatever-charisma-is-i-dont-have-it/2016/07/01/98f82a76-3f92-11e6-9e16-4cf01a41decb_video.html",
        "https://www.washingtonpost.com/video/world/kerry-special-relationship-with-uk-will-continue/2016/06/26/01e6695a-3bc2-11e6-9e16-4cf01a41decb_video.html"        
    ]
};