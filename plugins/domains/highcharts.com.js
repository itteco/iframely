module.exports = {

    re: /^https?:\/\/cloud\.highcharts\.com\/show\/(\w+)/i,    

    mixins: [
        "*"
    ],    

    getLink: function(urlMatch) {
        return {
            // href: '//cloud.highcharts.com/embed/' + urlMatch[1],
            // iFrame has height issues

            html: "<div id='highcharts-" + urlMatch[1] + "'><script src='//cloud.highcharts.com/inject/" + urlMatch[1] + "' defer='defer'></script></div>",
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.app, CONFIG.R.html5, CONFIG.R.inline],
            height: 500
        };
    },

    tests: [
        "https://cloud.highcharts.com/show/uqykon",
        "https://cloud.highcharts.com/show/equrij",
        "https://cloud.highcharts.com/show/ifihuh"
    ]

};