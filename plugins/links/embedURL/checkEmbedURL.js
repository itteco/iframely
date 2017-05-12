module.exports = {

    provides: '__allowEmbedURL',

    getData: function(meta, whitelistRecord) {

        // Allow slow cheerio parser, if whitelisted and no ld-json,
        // But do not call, if there is twitter:player as it's usually the best one
        if (whitelistRecord.isAllowed('html-meta.embedURL') && !(meta.ld && whitelistRecord.date > new Date(1485530476990))
            && !(whitelistRecord.isAllowed('twitter.player') && meta.twitter && meta.twitter.card == "player")) {
            return {
                __allowEmbedURL: true
            };
        }
    }
};