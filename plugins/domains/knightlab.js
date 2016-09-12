module.exports = {

    re: [
        /^https?:\/\/s3\.amazonaws\.com\/(?:uploads|CDN)\.knightlab\.com\/(storymapjs)\/\w+\/(?:[a-zA-Z0-9\-\/]+)\.html/i,
        /^https?:\/\/cdn\.knightlab\.com\/libs\/(storymapjs)\/(?:dev|latest)\/embed\//,        
        /^https?:\/\/cdn\.knightlab\.com\/libs\/(juxtapose|timeline3?)\/(?:dev|latest)\/embed\/index\.html\?/
    ],

    mixins: ["*"],

    getLink: function(url, urlMatch) {

        return {
                href: url.replace(/^https?:\/\//i, '//') + (url.indexOf('?') > -1 ? '&' :'?') + 'for=iframely',
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.app, CONFIG.R.html5],
                "height": urlMatch[1] == 'storymapjs' ? 800 : urlMatch[1] == 'juxtapose' ? 360: 650,
                scrolling: 'no'
            };
    },

    tests: [
        "https://s3.amazonaws.com/uploads.knightlab.com/storymapjs/86a5b5c6facef8e74eb685573b846f6b/civilian-deaths-evidence-of-war-crimes-in-yemen/index.html",
        "http://cdn.knightlab.com/libs//latest/embed/index.html?source=1t9XBaa5oqMpwgi49smaUdk269PL0miJ-xtjsuExOZwQ&font=Default&lang=en&initial_zoom=100&height=650",
        "https://cdn.knightlab.com/libs/juxtapose/latest/embed/index.html?uid=f9031656-dcc3-11e5-a524-0e7075bba956",
        "http://cdn.knightlab.com/libs/juxtapose/dev/embed/index.html?uid=75ec66e0-204a-11e5-91b9-0e7075bba956",
        "http://cdn.knightlab.com/libs/timeline/latest/embed/index.html?source=0Atwxho6G5yhjdEdJNU1JMzhLdjdHUTFMNnc4bHNud3c&font=PTSerif-PTSans&maptype=toner&lang=en&hash_bookmark=true&start_zoom_adjust=2&height=650#13",
        "http://cdn.knightlab.com/libs/storymapjs/latest/embed/?url=https://10113115706d4ad7837a4a5dd2c4cf80328d7999.googledrive.com/host/0B91AkpxdaWYyUmFYQ1Rlbmctd1k/published.json"
    ]
};