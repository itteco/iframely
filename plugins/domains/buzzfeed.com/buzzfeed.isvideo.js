module.exports = {

    re: [
        /^https?:\/\/www\.buzzfeed\.com\//i
    ],

    provides: "__isBuzzFeedVideo",

    getData: function(twitter, cb) {

        if (twitter.card === 'player') {
            cb(null, {
                __isBuzzFeedVideo: true
            });
        } else {
            cb();
        }

    }
};
