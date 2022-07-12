export default {

    re: /^https?:\/\/live\.amcharts\.com\/([a-zA-Z0-9\-]+)/i,

    mixins: ["*"],

    getLink: function(urlMatch) {

        return {
            accept: CONFIG.T.text_html,
            rel: CONFIG.R.app,
            href: 'https://live.amcharts.com/' + urlMatch[1] + '/embed/',
            "aspect-ratio": 16 / 9
        };
    },

    tests: [
        "https://live.amcharts.com/UxZGR/"
    ]
};