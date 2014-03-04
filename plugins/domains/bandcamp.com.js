module.exports = {

    re: [
        /^http:\/\/([a-z0-9-]+\.bandcamp\.com)\/(album|track)\/(\w+)/i,
        /^http:\/\/([a-z-\.]+)\/(album|track)\/([a-z-]+)/
    ],

    mixins: [
        "og-image",
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

    getLinks: function(meta, twitter) {

        if (twitter.site !== 'bandcamp') {
            return;
        }

        if (meta.og && meta.og.video && meta.twitter.site == "bandcamp") {

            return [{
                href: meta.og.video.url || meta.og.video,
                type: meta.og.video.type || CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.og],
                width: meta.og.video.width,
                height: meta.og.video.height
            }, {
                href: meta.og.video.secure_url,
                type: meta.og.video.type || CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.og],
                width: meta.og.video.width,
                height: meta.og.video.height
            }, {
                href: meta.twitter.player.value,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.twitter],
                "aspect-ratio": meta.twitter.player.width / meta.twitter.player.height,
                "max-width": 700
            }]
        }        

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
        "http://hannibalkingmusic.com/album/flowers-for-pamela",
        "http://music.freddiejoachim.com/album/patiently",
        {
            skipMixins: [
                "og-description"
            ]
        }
    ]
};