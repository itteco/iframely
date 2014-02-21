module.exports = {

    getLinks: function(twitter, whitelistRecord) {

        if (!twitter.image)
            return;

        var rel;
        var links = [];

        // TODO: make whitelistRecord.isAllowed always existing method?
        if (whitelistRecord && twitter.card == "photo" && whitelistRecord.isAllowed && whitelistRecord.isAllowed('twitter.photo')) {
            rel = CONFIG.R.image;
        } else {
            rel = CONFIG.R.thumbnail;
        }

        links.push({
            href: twitter.image.url || twitter.image.src || twitter.image,
            type: CONFIG.T.image,
            rel: [rel, CONFIG.R.twitter],
            width: twitter.image.width,
            height: twitter.image.height
        });

        if (twitter.card == "gallery") {
            var i; // JSLint :\\

            for (i=3; i>=0; i--) {
                if (twitter['image'+i]) {
                    links.push({
                        href: twitter['image'+i].src || twitter['image'+i],
                        type: CONFIG.T.image,
                        rel: [CONFIG.R.thumbnail, CONFIG.R.twitter]
                    });
                }
            }
        }

        return links;
    }
};