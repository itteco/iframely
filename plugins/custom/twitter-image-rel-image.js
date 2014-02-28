module.exports = {

    getLink: function(twitter) {

        if (!twitter.image)
            return;

        return {
            href: twitter.image.url || twitter.image.src || twitter.image,
            type: CONFIG.T.image,
            rel: [CONFIG.R.image, CONFIG.R.twitter],
            width: twitter.image.width,
            height: twitter.image.height
        };
    }
};