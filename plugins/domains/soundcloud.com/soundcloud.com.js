import * as URL from 'url';

export default {

    provides: ['__allow_soundcloud_meta', 'sound'],

    mixins: [
        "oembed-title",
        "oembed-site",
        "oembed-author",
        "oembed-description",
        "oembed-iframe",
        // do not link to meta as it disables support for direct player urls redirects from w.soundcloud.com
        "domain-icon"
    ],

    getLink: function(iframe, sound, options) {

        var links = [];

        if (iframe.src && sound.count !== 0) {

            var params = Object.assign(iframe.query);

            if (options.getRequestOptions('players.horizontal', options.getProviderOptions('soundcloud.old_player'))) {
                params.visual = false;
            }
            if (options.getRequestOptions('soundcloud.hide_comments') !== undefined) {
                params.show_comments = !options.getRequestOptions('soundcloud.hide_comments');
            }
            if (options.getRequestOptions('soundcloud.hide_artwork') !== undefined) {
                params.show_artwork = !options.getRequestOptions('soundcloud.hide_artwork');
            }
            if (options.redirectsHistory && /^https:\/\/w\.soundcloud\.com\/player\//.test(options.redirectsHistory[0])) {
                var original = URL.parse(options.redirectsHistory[0], true).query?.color;
                var color = original && decodeURIComponent(original);
                if (color && !options.getProviderOptions('app.disable_url_options', false)) {
                    params.color = color; // overide with provider options below, if any
                }
            }
            if (options.getRequestOptions('soundcloud.color')) {
                params.color = options.getProviderOptions('soundcloud.color');
            }

            var href = iframe.assignQuerystring(params);
            var height = options.getRequestOptions('soundcloud.height', options.getProviderOptions('players.horizontal') === false ? 0 : (/visual=false/.test(href) ? 166 : iframe.height));
            // Fallback to old values.
            if (height === 'auto') {
                height = 0;
            }
            var opts = {
                horizontal: {
                    label: CONFIG.L.horizontal,
                    value: /visual=false/.test(href)
                },
                hide_comments: {
                    label: 'Hide timed comments',
                    value: /show_comments=false/.test(href)
                },
                hide_artwork : {
                    label: CONFIG.L.hide_artwork,
                    value: /show_artwork=false/.test(href)
                },
                height: {
                    label: CONFIG.L.height,
                    value: height,
                    values: {
                        300: '300px',
                        400: '400px',
                        600: '600px',
                        0: 'Let Iframely optimize player for the artwork'
                    }
                }
            };
            if (height !== 0) {
                opts.height.values[height] = height + 'px';
            }

            if (/visual=true/.test(href)) {
                delete opts.hide_artwork;
            } else {
                delete opts.height;
            }

            links.push({
                href: href,
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.audio],
                autoplay: "auto_play=true",
                media: height === 0 ? {
                    'aspect-ratio': 1, // the artwork is always 500x500
                    'max-width': 600, 
                } : {
                    height: /visual=false/.test(href) ? 166 : height
                },
                options: opts
            });
        }

        if (sound.thumbnail && !/\/images\/fb_placeholder\.png/.test(sound.thumbnail.url)) {
            links.push({
                href: sound.thumbnail.url,
                type: CONFIG.T.image,
                rel: [CONFIG.R.thumbnail, CONFIG.R.oembed],
                width: sound.thumbnail.width,
                height: sound.thumbnail.height
            });
        }

        return links;
    },

    getData: function (url, oembed) {
        if (
            /* Don't request meta for w.soundcloud.com widget redirects, html parser gets 401 there. */
            !/w\.soundcloud\.com/i.test(url)
            && ((
                /* Skip the placeholder thumbnail in oEmbed - use user picture in og image instead. */
                !oembed.thumbnail_url || /\/images\/fb_placeholder\.png/.test(oembed.thumbnail_url)
                
                /* Also, check meta and try to exclude user profiles with 0 tracks. */
                || /api\.soundcloud\.com(%2F|\/)users(%2F|\/)/i.test(oembed.html)
            ) || !oembed.description)
        ) {
            return {
                __allow_soundcloud_meta: true
            }
            
        } else {
            /* Ignore fallbacks, go directly to regular flow */
            return {
                sound: {
                    count: 1,
                    thumbnail: {
                        url: oembed.thumbnail_url,
                        width: oembed.thumbnail_width,
                        height: oembed.thumbnail_height
                    }
                }
            }
        }
    },

    tests: [{skipMethods: ["getData"]}, {skipMixins: ["oembed-description"]},
        "https://soundcloud.com/user-847444",
        "https://m.soundcloud.com/claude-debussy/clair-de-lune",
        // user profile with no tracks: https://soundcloud.com/mata-klol    

        // The following URLs redirect to this plugin and should also work.
        "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/282055227%3Fsecret_token%3Ds-Ct4TV&color=00cc11&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false",
        "https://w.soundcloud.com/player?auto_play=false&origin=twitter&show_artwork=true&url=https%3A%2F%2Fapi.soundcloud.com%2Fplaylists%2F349557245&visual=true"
    
    ]
};
