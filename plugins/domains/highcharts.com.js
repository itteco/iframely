module.exports = {

    re: /^https?:\/\/cloud\.highcharts\.com\/show\/(\w+)/i,    

    mixins: [
        "*"
    ],    

    getLink: function(urlMatch) {
        return {
            href: '//cloud.highcharts.com/embed/' + urlMatch[1],
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.app, CONFIG.R.html5],
            height: 400 // even though they give 500px for manual copy-paste, it is actually 400px
        };
    },

    tests: [
        "https://cloud.highcharts.com/show/uqykon",
        "https://cloud.highcharts.com/show/equrij"
    ]

};