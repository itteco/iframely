module.exports = {

    re: [
        // hosted bandcamp is now covered via og:url redirect in general plugins. Requires FB user agent
        /^https?:\/\/([a-z0-9-\.]+)\/(album|track)\/([a-z0-9-]+)\/?$/i // watch out for overlay with play.spotify.com which has digits
    ],

    getLink: function(url, meta, options, cb) {

        if (!/bandcamp/i.test(meta.twitter && meta.twitter.site || meta.generator)
            || !meta.og || !meta.og.url || meta.og.url == url || 
            (options.redirectsHistory && options.redirectsHistory.indexOf(meta.og.url) > -1)) {

            return cb (null);

        } else {

            return cb ({
                    redirect: meta.og.url
                });
        }
        
    },

    tests: [
        "http://music.dopapod.com/track/faba-92"
    ]
};