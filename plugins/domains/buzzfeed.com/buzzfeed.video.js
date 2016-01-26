module.exports = {

    provides: '__promoUri',    

    re: [
        /^https?:\/\/www\.buzzfeed\.com\//i
    ],

    mixins: [
        "*"
    ],    

    getData: function(cheerio, __isBuzzFeedVideo, cb) {

        var $el = cheerio('.video-embed-area');
        var embed = JSON.parse($el.attr('rel:bf_bucket_data'));

        if (embed.video && embed.video.url) {
            cb (null, {
                __promoUri: embed.video.url.replace(/^http:\/\/youtube/, 'https://www.youtube')
            });
        } else {
            cb();
        }
    },

    tests: [ 
        "http://www.buzzfeed.com/brentbennett/star-wars-cast-members-do-star-wars-impersonations#.idE4zm45aA",
        "http://www.buzzfeed.com/tristanhill/if-you-won-the-lottery"
    ]
};
