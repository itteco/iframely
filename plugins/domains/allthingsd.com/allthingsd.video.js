module.exports = {

    re: /^http:\/\/allthingsd\.com\/video\/\?video_id=([\w-]+)/i,

    mixins: [
        "html-title",
        "description",

        "favicon",
        "image_src"
    ],

    getLink: function(urlMatch) {

        return {
            href: "http://live.wsj.com/public/page/embed-" + urlMatch[1].replace(/-/g, "_") + ".html",
            type: CONFIG.T.text_html,
            rel: CONFIG.R.player,
            "aspect-ratio": 512 / 288
        };
    },

    tests: [
        "http://video.allthingsd.com/video/toytalk-puts-new-spin-on-interactive-kids-app/B7A00844-64C7-4C34-8724-D9F441EE3EDB",
        {
            page: "http://allthingsd.com/video/",
            selector: ".wsjdn-video"
        }
    ]
};