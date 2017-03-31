module.exports = {

    re: [
        /^https?:\/\/[a-z0-9-]+\.bandcamp\.com\/(album|track)\/(\w+)/i,
        /^https?:\/\/[a-z0-9-]+\.bandcamp\.com/i,
        // hosted bandcamp with digits is now covered via og:url redirect in general plugins. Requires FB user agent
        /^https?:\/\/([a-z-\.]+)\/(album|track)\/([a-z-]+)\/?$/i // watch out for overlay with play.spotify.com which has digits
    ],

    mixins: [
        "og-image",
        "twitter-image",
        "favicon",
        "canonical",
        "og-description",
        "og-title"
    ],

    getMeta: function(meta, twitter) {

        if (twitter.site !== 'bandcamp') {
            return;
        }

        return {
            site: "Bandcamp",
            author: meta.og.site_name
        };
    },

    getLinks: function(meta, options) {

        if (!/bandcamp/i.test(meta.twitter && meta.twitter.site || meta.generator)) {
            return;
        }
        
        var params = options.getProviderOptions('bandcamp');
        var result = [];

        if (!params) {

            if (meta.twitter && meta.twitter.player) {
                result.push({
                    href: meta.twitter.player.value,
                    type: CONFIG.T.text_html,
                    rel: [CONFIG.R.player, CONFIG.R.twitter, CONFIG.R.html5],
                    "aspect-ratio": 1, // it will just overlay the player nicely
                    "max-width": 700
                });
            }

            if (meta.og && meta.og.video) {
                result.push({
                    href: meta.og.video.secure_url || meta.og.video.url,
                    type: meta.og.video.type || CONFIG.T.text_html,
                    rel: [CONFIG.R.player, CONFIG.R.og, CONFIG.R.html5],
                    "max-width": 700,
                    height: meta.og.video.height
                });
            }

        } else if (params) {

            var player = (meta.twitter && meta.twitter.player && meta.twitter.player.value) ||
                        (meta.og && meta.og.video && meta.og.video.url);

            if (player) {

                var album = /album=\d+/i.test(player) && player.match(/album=(\d+)/i)[1];
                var track = /track=\d+/i.test(player) && player.match(/track=(\d+)/i)[1];

                result.push ({
                    href: 'https://bandcamp.com/EmbeddedPlayer' + (album ? '/album=' + album : '') + (track ? '/track=' + track : '') + params.get_params, // (in /../../ way)
                    rel: [CONFIG.R.player, CONFIG.R.html5],
                    type: CONFIG.T.text_html,
                    media: album ? params.media.album : params.media.track
                });
            }

        }

        return result;

    },

    tests: [{
        feed: "http://mellomusicgroup.bandcamp.com/feed"
        },
        "http://mad-hop.bandcamp.com/track/fracture",
        "http://music.zackhemsey.com/album/ronin",
        "http://music.zackhemsey.com/track/dont-get-in-my-way",
        "http://yancyderon.com/album/the-difference-sp",
        "http://music.freddiejoachim.com/album/begonia",
        "http://radiojuicy.com/album/rio",
        "http://music.freddiejoachim.com/album/patiently",
        "https://decembersongs.bandcamp.com/",
        "http://sonsofoflaherty.bandcamp.com/album/misc-songs",
        "http://badsheeps.bandcamp.com/album/bad-sheeps", // doesn't have twitter player when not published
        {
            skipMixins: [
                "og-description"
            ]
        }
    ]
};