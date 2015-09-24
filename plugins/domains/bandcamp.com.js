module.exports = {

    re: [
        /^https?:\/\/[a-z0-9-]+\.bandcamp\.com\/(album|track)\/(\w+)/i,
        /^https?:\/\/[a-z0-9-]+\.bandcamp\.com/i,
        /^https?:\/\/([a-z-\.]+)\/(album|track)\/([a-z-]+)/
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

    getLinks: function(meta, twitter) {

        if (twitter.site !== 'bandcamp') {
            return;
        }

        if (meta.og && meta.og.video && meta.twitter.site == "bandcamp") {

            return [{
                href: meta.twitter.player.value,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.twitter, CONFIG.R.html5],
                "aspect-ratio": 1, // it will just overlay the player nicely
                "max-width": 700
            }, {
                href: meta.og.video.secure_url || meta.og.video.url,
                type: meta.og.video.type || CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.og, CONFIG.R.html5],
                "max-width": 700,
                height: meta.og.video.height
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
        "https://decembersongs.bandcamp.com/",
        {
            skipMixins: [
                "og-description"
            ]
        }
    ]
};