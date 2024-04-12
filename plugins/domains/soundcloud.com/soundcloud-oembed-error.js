export default {

    provides: ['__allow_soundcloud_meta', 'iframe'],

    getData: function(oembedError, twitter, options, cb) {
        if (oembedError === 403 && !options.getProviderOptions('soundcloud.disable_private', false) && twitter.player) {
            return cb(null, {
                __allow_soundcloud_meta: true,
                iframe: {
                    src: twitter.player.value,
                    height: twitter.player.height
                },
                message: "Contact support to disable private Soundcloud audio."
            });
        } else if (oembedError === 403 && options.getProviderOptions('soundcloud.disable_private', false)) {
            return cb({
                responseError: oembedError
            });
        } else if (oembedError === 404 && !twitter.title) {
            return cb({
                responseError: 404
            });            
        } else {
            return cb(null, null); // fallback to generic parsers.
        }
    },

    tests: [
        "https://soundcloud.com/bloomberg-business/first-word-asia-nov-16-2015/s-WxWfd", // should be 404
        "https://soundcloud.com/fadermedia/young-l-loud-pockets-hudson"
    ]
};