module.exports = {

    getLinks: function(meta, whitelistRecord) {

        if (!meta.twitter || !meta.twitter.image)
            return;

        var rel;
        var links = [];

        // TODO: make whitelistRecord.isAllowed always existing method?
        if (meta.twitter.card == "photo" && whitelistRecord.isAllowed && whitelistRecord.isAllowed('twitter.photo')) {
            rel = CONFIG.R.image;
        } else {
            rel = CONFIG.R.thumbnail;
        }

        links.push({
            href: meta.twitter.image.url || meta.twitter.image.src || meta.twitter.image,
            type: CONFIG.T.image,
            rel: [rel, CONFIG.R.twitter],
            width: meta.twitter.image.width,
            height: meta.twitter.image.height
        });

        if (meta.twitter.card == "gallery") {
            var i; // JSLint :\\

            for (i=3; i>=0; i--) {
                if (meta.twitter['image'+i]) 
                    links.push({
                        href: meta.twitter['image'+i].src || meta.twitter['image'+i],
                        type: CONFIG.T.image,
                        rel: [CONFIG.R.thumbnail, CONFIG.R.twitter],                        
                    });
            }
        }

        return links;
    }
};