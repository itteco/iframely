module.exports = {

    re: [
        /^https?:\/\/[a-z0-9-]+\.bandcamp\.com\/(album|track)\/(\w+)/i,
        /^https?:\/\/[a-z0-9-]+\.bandcamp\.com/i,
        // hosted bandcamp with digits is now covered via og:url redirect in general plugins. Requires FB user agent
        /^https?:\/\/([a-z-\.]+)\/(album|track)\/([a-z-]+)\/?$/i // watch out for overlay with play.spotify.com which has digits
    ],

    mixins: [
        "og-image",
        "favicon",
        "canonical",
        "og-description",
        "og-title"
    ],

    getMeta: function(meta, twitter) {

        if (!/^@?bandcamp$/i.test(twitter.site)) {
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

        var video_src = (meta.twitter && meta.twitter.player && meta.twitter.player.value) 
                        || (meta.og && meta.og.video && meta.og.video.url);

        if (video_src) {

            var album = /album=\d+/i.test(video_src) && video_src.match(/album=(\d+)/i)[1];
            var track = /track=\d+/i.test(video_src) && video_src.match(/track=(\d+)/i)[1];

            var href = 'https://bandcamp.com/EmbeddedPlayer' + (album ? '/album=' + album : '')

                    + (options.getProviderOptions('bandcamp.get_params') ? 
                        
                        options.getProviderOptions('bandcamp.get_params') 
                        : ('/size=large/bgcol=ffffff/linkcol=0687f5'
                            + (
                            options.getProviderOptions('bandcamp.small_player', false) || options.getProviderOptions(CONFIG.O.compact, false) ? 
                            '/artwork=small/tracklist=false' : '/minimal=true'
                            )
                            + '/transparent=true'
                        )
                    )
                    + (track ? '/track=' + track : '')
                    + '/';

            if (!options.getProviderOptions('bandcamp.get_params') && options.getProviderOptions('bandcamp.small_player', false) && options.getProviderOptions(CONFIG.O.full, false)) {
                href = href.replace("/artwork=small/tracklist=false/", "/minimal=true/")
            }

            var media;

            if (options.getProviderOptions('bandcamp.get_params') && options.getProviderOptions('bandcamp.media')) {
                media = (album ? options.getProviderOptions('bandcamp.media').album : options.getProviderOptions('bandcamp.media').track);
            } else {

                media = {'max-width' : 700};
                if (/\/minimal=true\//i.test(href)) {
                    media['aspect-ratio'] = 1;                    
                } else {
                    media.height = 120;
                }

            }

            return {
                href: href,
                rel: [CONFIG.R.player, CONFIG.R.audio, CONFIG.R.html5],
                type: CONFIG.T.text_html,
                media: media
            };

        }
    },

    tests: [{
        page: "https://mellomusicgroup.bandcamp.com/",
        selector: ".music-grid-item>a",
        skipMixins: [
            "og-description"
        ]
    },
        "http://mad-hop.bandcamp.com/track/fracture",
        "http://music.zackhemsey.com/album/ronin",
        "http://music.zackhemsey.com/track/dont-get-in-my-way",
        "https://decembersongs.bandcamp.com/",
        "http://sonsofoflaherty.bandcamp.com/album/misc-songs",
        "http://badsheeps.bandcamp.com/album/bad-sheeps" // doesn't have twitter player when not published
    ]
};