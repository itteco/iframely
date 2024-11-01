export default {

    provides: ['__allow_soundcloud_meta', 'iframe'],

    getData: function(__oembedError, twitter, options, plugins, cb) {
        var oembedError = __oembedError;
        var disable_private = options.getProviderOptions('soundcloud.disable_private', false)
        if (oembedError === 403 && !disable_private && twitter.player) {
            return cb(null, {
                __allow_soundcloud_meta: true,
                iframe: plugins['oembed'].getIframe({
                    src: twitter.player.value?.replace('origin=twitter', 'origin=iframely'),
                    height: twitter.player.height
                }),
                message: "Contact support to disable private Soundcloud audio."
            });
        } else if (oembedError === 403 && disable_private) {
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