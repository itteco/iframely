module.exports = {

    mixins: [
        "html-title",
        "image_src",
        "description"
    ],

    getMeta: function() {
        return {
            site: "bravotv.com"
        };
    },

    getLink: function(html) {

        var videoIdMatch = html.match(/"(_(vid)\d+)"/);

        var videoId = videoIdMatch ? videoIdMatch[1] : null;

        if (videoId) {
            return {
                href: 'http://www.bravotv.com/video/embed/?/' + videoId,
                type: CONFIG.T.text_html,
                rel: CONFIG.R.player,
                width: 400,
                height: 225
            }
        }
    },

    tests: [{
        page: "http://www.bravotv.com/videos",
        selector: "#content .title a"
    },
        "http://www.bravotv.com/top-chef-masters/season-4/videos/thai-bye"
    ]
};