module.exports = {

    mixins: [
        "*"
    ],

    getLink: function (og, request, cb) {

        if (og.video && og.video.secure_url) {

            request({
                uri: og.video.secure_url,
                followRedirect: false,
                prepareResult: function(error, response, body, cb) {

                    if (error) {
                        return cb(error);
                    }

                    return cb (null, {
                        href: response.headers.location ? response.headers.location.replace(/^http/, 'https') : og.video.secure_url, // ssl re-directs to non-ssl.
                        type: og.video.type,
                        rel: [CONFIG.R.player, CONFIG.R.autoplay],
                        "aspect-ratio": og.video.width / og.video.height
                    });

                }
            }, cb);

        } else {
            return cb(null);
        }
    }
};