export default {

    re: [
        /^https?:\/\/www\.buzzfeed\.com\//i
    ],

    provides: "__isBuzzFeedVideo",

    getData: function(twitter, cb) {

        if (twitter.card === 'player' || twitter.site === '@BuzzFeedVideo') {
            cb(null, {
                __isBuzzFeedVideo: true
            });
        } else {
            cb();
        }

    }
};
