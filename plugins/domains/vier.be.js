var re = /^https?:\/\/www\.vier\.be\/\w+\/videos\/[a-zA-Z0-9\-]+\/(\d+)/i;

module.exports = {

    re: re,

    mixins: ["*"],

    getLinks: function(urlMatch) {

        var id = urlMatch[1];
         
        return {
            href: "http://www.vier.be/video/v3/embed/" + id,
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.player, CONFIG.R.html5],
            "aspect-ratio": 800 / 450
        };
    },

    tests: [{
        page: "http://www.vier.be/video-overzicht",
        selector: ".field-type-image a",
        getUrl: function(url) {
            if (url.match(re)) return url;
        }
    }]
};