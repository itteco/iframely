export default {

    re: /^https?:\/\/www\.nbcnews\.com\/(?:[a-z\-]+\/)?videos?\/[a-zA-Z0-9-]+\-(\d+)/i,

    mixins: ["*"],

    // It's the same as in whitelist.
    // Plugin remains in place for media=player and also for the test URLs
    getLink: function(schemaVideoObject) {

        return {
            href: schemaVideoObject.embedURL || schemaVideoObject.embedurl,
            rel: [CONFIG.R.player, CONFIG.R.html5],
            accept: CONFIG.T.text_html,
            "aspect-ratio": 560/315
        };
    },

    tests: [
        "https://www.nbcnews.com/nightly-news/video/nbc-news-lester-holt-goes-inside-lab-creating-potential-coronavirus-treatment-80433221758",
        "https://www.nbcnews.com/video/obama-america-is-not-as-divided-as-some-suggest-721895491854",
        "https://www.nbcnews.com/nightly-news/video/wife-s-video-shows-deadly-encounter-between-keith-scott-and-police-772184131883"
    ]
};