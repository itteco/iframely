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

            var href = 'https://bandcamp.com/EmbeddedPlayer' + (album ? '/album=' + album : '');

            if (options.getProviderOptions('bandcamp.get_params')) {
                return {
                    href: href + options.getProviderOptions('bandcamp.get_params') + (track ? '/track=' + track : '') + '/',
                    rel: [CONFIG.R.player, CONFIG.R.audio, CONFIG.R.html5],
                    type: CONFIG.T.text_html,
                    media: album ? options.getProviderOptions('bandcamp.media').album : options.getProviderOptions('bandcamp.media').track
                }
            } else {
                var horizontal = options.getProviderOptions('players.horizontal', options.getProviderOptions('bandcamp.small_player', options.getProviderOptions(CONFIG.O.less)));
                var opts = {
                    layout: {
                        label: 'Layout',
                        value: options.getRequestOptions('bandcamp.layout', horizontal === false ? 'artwork' : 'standard'),
                        values: {
                            slim: 'Slim',
                            artwork: 'Artwork-only',
                            standard: 'Standard',
                        }
                    }
                };

                if (opts.layout.value !== 'artwork') {
                    // for slim and standard players
                    opts.artwork = {
                        label: 'Artwork',
                        value: options.getRequestOptions('bandcamp.artwork', 'small'),
                        values: {
                            small: 'Small',
                            big: 'Big',
                            none: 'None'
                        }
                    };
                    if (opts.layout.value !== 'slim') {
                        opts.playlist = {
                            label: CONFIG.L.playlist,
                            value: options.getRequestOptions('bandcamp.playlist', false)
                        };
                    }
                }

                opts.theme = {
                    label: CONFIG.L.theme,
                    value: options.getRequestOptions('players.theme', 'light'),
                    values: {
                        light: CONFIG.L.light,
                        dark: CONFIG.L.dark
                    }
                };

                href += (opts.layout.value === 'slim' ? '/size=small' : '/size=large')
                    + (opts.theme.value === 'light' ? '/bgcol=ffffff/linkcol=333333' : '/bgcol=333333/linkcol=ffffff')
                    + (opts.playlist && !opts.playlist.value ? '/tracklist=false' : '')
                    + (opts.layout.value === 'artwork' 
                        ? '/minimal=true' 
                        : (opts.artwork && opts.artwork.value === 'big' 
                            ? '' : (opts.layout.value !== 'slim' || opts.artwork.value === 'none' 
                                ? '/artwork=' + opts.artwork.value : '')))
                    + (track ? '/track=' + track : '')
                    + '/transparent=true/';

                var player = {
                    href: href,
                    rel: [CONFIG.R.player, CONFIG.R.audio, CONFIG.R.html5],
                    type: CONFIG.T.text_html,
                    options: opts
                };

                player.media = {'max-width' : 700};
                if (/\/minimal=true\//i.test(href)) {
                    player.media['aspect-ratio'] = 1;
                } else if (/\/size=small/.test(href)) {
                    player.media.height = 42;
                } else if (/\/tracklist=false/.test(href) && /\/artwork=(small|none)/.test(href)) {
                    player.media.height = 120;
                } else if (/\/tracklist=false/.test(href) && !/\/artwork=/.test(href)) {
                    player.media['aspect-ratio'] = 1;
                    player.media['padding-bottom'] = 120;
                } else if (!/\/artwork=/.test(href)) { // tracklist = true
                    player.media['aspect-ratio'] = 1;
                    player.media['padding-bottom'] = 205;
                } else { // finally, standard player with a tracklist and with or without an artwork
                    player.media.height = 241;
                }

                return player;
            }
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