export default {

    getLinks: function(twitter, meta, whitelistRecord) {

        var links = [];

        if (twitter.card === "gallery") {
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

        var isPhotoCard = twitter.card === "photo";
        if (!isPhotoCard && twitter.card instanceof Array) {
            isPhotoCard = twitter.card.indexOf("photo") > -1;
        }

        if (!twitter.image && !isPhotoCard) {
            return links;
        }

        var rel = [CONFIG.R.twitter];

        if (isPhotoCard && whitelistRecord.isAllowed && whitelistRecord.isAllowed('twitter.photo')) {
            rel.push(CONFIG.R.image);

            if (twitter.image && (twitter.image.url || twitter.image.src || (typeof twitter.image === 'string'))) {

                links.push({
                    href: twitter.image.url || twitter.image.src || twitter.image,
                    type: CONFIG.T.image,
                    rel: rel,
                    width: twitter.image.width,
                    height: twitter.image.height
                });

            } else if (meta.og.image) { //falback to og

                links.push({
                    href: meta.og.image.url || ((meta.og.image instanceof Array) ? meta.og.image[0] : meta.og.image),
                    type: meta.og.image.type || CONFIG.T.image,
                    rel: rel,
                    width: meta.og.image.width,
                    height: meta.og.image.height
                });

            }

        } else if (twitter.image) {

            rel.push(CONFIG.R.thumbnail);

            links.push({
                href: twitter.image.url || twitter.image.src || twitter.image,
                type: CONFIG.T.image,
                rel: rel,
                width: twitter.image.width,
                height: twitter.image.height
            });            
        }

        return links;
    }
};