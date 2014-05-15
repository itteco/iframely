module.exports = {

    re: /^https?:\/\/www\.theonion\.com\/video\/*/i,

    mixins: [
        "canonical",
        "favicon",
        "og-image",
        "copyright",
        "og-description",
        "og-title"
    ],

    getLink: function(cheerio) {

        var $video = cheerio('video');
        if (!$video.length || !$video.attr('id')) return;

        return {
            href: 'http://www.theonion.com/video_embed/?id=' + $video.attr('id'),
            type: CONFIG.T.text_html,
            rel: CONFIG.R.player,
            "aspect-ratio": 480 / 270
        };
    },

    tests: [{
        page: "http://www.theonion.com/video/",
        selector: ".title h1 a"
    }]
};