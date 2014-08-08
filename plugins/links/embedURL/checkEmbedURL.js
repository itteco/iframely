module.exports = {

    provides: '__allowEmbedURL',

    getData: function(meta, whitelistRecord) {

    	// Allow slow cheerio parser, if whitelisted, 
    	// But do not call, if there is twitter:player as it's usually the best one
        if (whitelistRecord && whitelistRecord.isAllowed('html-meta.embedURL') 
        					&& !(whitelistRecord.isAllowed('twitter.player') && meta.twitter && meta.twitter.card == "player")) {
            return {
                __allowEmbedURL: true
            };
        }
    }
};