module.exports = {

    re: /^https?:\/\/cloud\.highcharts\.com\/(?:show|charts)\/(\w+)/i,

    mixins: [
        "*"
    ],    

    getLink: function(urlMatch) {
        return {
            // href: '//cloud.highcharts.com/embed/' + urlMatch[1],
            // iFrame has height issues

            html: "<div id='highcharts-" + urlMatch[1] + "'><script src='//cloud.highcharts.com/inject/" + urlMatch[1] + "' defer='defer'></script></div>",
            type: CONFIG.T.text_html,
            rel: [CONFIG.R.app, CONFIG.R.html5, CONFIG.R.ssl],
            // leave them not inline - otherwise they are not responsive on load
            // height: 500
        };
    },

    getData: function(meta, cb) {
        return cb(meta.twitter || meta.og ? null : {responseStatusCode: 404});
    },

    tests: [{skipMethods: ["getData"]},
        "https://cloud.highcharts.com/show/uqykon",
        "https://cloud.highcharts.com/show/equrij",
        "https://cloud.highcharts.com/show/ifihuh",
        "http://cloud.highcharts.com/show/akijequ"
        // n/a http://cloud.highcharts.com/show/ebanol/3
    ]

};