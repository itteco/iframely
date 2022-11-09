export default {

    provides: '__promoUri',    

    re: [
        /^https?:\/\/www\.buzzfeed\.com\//i
    ],

    mixins: [
        "*"
    ],    

    getData: function(cheerio, __isBuzzFeedVideo, cb) {

        var $el = cheerio('.js-placeholder-link');

        var href = $el.attr('href');

        if (href && /youtube\.com/.test(href)) {
            cb (null, {
                __promoUri: href.replace(/^http:\/\/youtube/, 'https://www.youtube')
            });
        } else {
            cb();
        }
    },

    tests: [{
        noFeeds: true
    },
        "http://www.buzzfeed.com/brentbennett/star-wars-cast-members-do-star-wars-impersonations#.idE4zm45aA"
    ]
};
