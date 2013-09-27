module.exports = {

    re: /^http:\/\/live\.wsj\.com\/#!([\w-]+)/i,

    // TODO: make redirect to allthingsd. There is better meta.

    mixins: [
        "html-title",
        "description",
        "site",

        "favicon""
    ],

    getLink: function(urlMatch) {

        return {
            href: "http://live.wsj.com/public/page/embed-" + urlMatch[1].replace(/-/g, "_") + ".html",
            type: CONFIG.T.text_html,
            rel: CONFIG.R.player,
            width: 512,
            height: 288
        };
    },

    tests: [
        "http://live.wsj.com/#!1EA0E71E-2781-47AC-90E0-0C7709002966",
        {
            noFeeds: true
        }
    ]
};