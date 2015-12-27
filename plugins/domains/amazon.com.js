var $ = require('cheerio');

module.exports = {

    re: /^https?:\/\/www\.amazon\.(com|ca|com\.au|be|dk|de|es|fr|in|ie|it|nl|co\.nz|no|at|pt|ch|fi|se|ae|pl|co\.uk|co\.jp)\/([a-zA-Z0-9\-]+\/)?dp\/[a-zA-Z0-9\-]+/i,

    provides: "__isAmazonImageNeeded",

    mixins: [
        "*"
    ],

    getLink: function(__isAmazonImageNeeded, cheerio) {

        // Smart move: grab missing image from Pinterest share button
        var $pin = cheerio('#tell-a-friend-byline a[href*="pinterest"], #tell-a-friend a[href*="pinterest"]');

        if ($pin.length) {
            
            href = $pin.attr('href');
            
            return {
                href: decodeURIComponent(decodeURIComponent(href.match(/media%3D([^&]+)/i)[1])),
                rel: CONFIG.R.thumbnail,
                type: CONFIG.T.image
            }
        }
    },

    getData: function (meta) {
        if ((meta.twitter && meta.twitter.image) || (meta.og && meta.og.image)) {
            return;
        } else {
            return {
                __isAmazonImageNeeded: true
            }
        }
    },

    tests: [
        "http://www.amazon.com/Vegucated/dp/B006LZSF8M/ref=sr_1_1?s=instant-video&ie=UTF8&qid=1372118186&sr=1-1&keywords=vegucated",
        "http://www.amazon.com/The-Whole-Truth-Shaw-Book-ebook/dp/B0011UCPM4/ref=pd_zg_rss_ts_b_17_6?ie=UTF8&tag=recomshop-22",
        "http://www.amazon.co.uk/Vegetable-Perfection-tasty-recipes-shoots/dp/1849757097/ref=asap_bc?ie=UTF8",
        "http://www.amazon.com/Tapestry-Hanging-Mandala-Tapestries-Bedspread/dp/B00ODVE012/ref=sr_1_75?s=furniture&ie=UTF8&qid=1450055989&sr=1-75&keywords=tapestry",
        "http://www.amazon.ca/The-Fight-Security-Failings-Political/dp/1250082986?tag=smarturl-ca-20"
    ]
};