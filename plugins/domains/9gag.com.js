module.exports = {

    re: [
        /^http:\/\/9gag\.com\/gag\/([a-z0-9\-]+)/i
    ],

    // No other meta data is returned for 9gags as otherwise the response time would be more than 10sec
    getMeta: function(urlMatch) {
        return {
            canonical: 'http:\\9gag.com/gag' + urlMatch[1]
        }
    },

    getLink: function(urlMatch) {

        return [{
            href: '//d24w6bsrhbeh9d.cloudfront.net/photo/' + urlMatch[1] + '_700b.jpg',
            type: CONFIG.T.image,
            rel: [CONFIG.R.image, CONFIG.R.iframely]
        }, {
            href: '//d24w6bsrhbeh9d.cloudfront.net/static/main/core/20130208_1360298583/img/favicon_v2.png',
            type:CONFIG.T.image,
            rel:[CONFIG.R.icon, CONFIG.R.iframely]
        }]
    },

    tests: [ {
        page: "http://9gag.com",
        selector: "h1 a.badge-section-link-target"
    },
        "http://9gag.com/gag/5500821"
    ]
};