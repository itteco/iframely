module.exports = {

    re: [
        /^https?:\/\/www\.56\.com\/\w{3}\/v_([a-zA-Z0-9]+).html/i,
        /^https?:\/\/www\.56\.com\/\w{3}\/play_[a-zA-Z0-9\-]+_vid\-([a-zA-Z0-9]+).html/i
    ],

    mixins: ["*"],

    getLink: function(urlMatch) {

        return {
                href: "http://www.56.com/iframe/" + urlMatch[1],
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.html5],
                "aspect-ratio": 480 / 405
            };
    },

    tests: [{
        page: 'http://www.56.com/',
        selector: '#index_focus .cfix h3 a'
    }]
};