export default {

    getLink: function(twitter) {

        var isPhotoCard = twitter.card === "photo";
        if (!isPhotoCard && twitter.card instanceof Array) {
            isPhotoCard = twitter.card.indexOf("photo") > -1;
        }

        if (!twitter.image || !isPhotoCard) {
            return;
        }

        return {
            href: twitter.image.url || twitter.image.src || twitter.image,
            type: CONFIG.T.image,
            rel: [CONFIG.R.image, CONFIG.R.twitter],
            width: twitter.image.width,
            height: twitter.image.height
        };
    }
};