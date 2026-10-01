// import got from 'got'; // was required for tests

export default {

    mixins: [
        "oembed-title",
        "oembed-author",
        "oembed-site",
        "oembed-thumbnail",
        "domain-icon",
        "og-description",
        "og-image",
        "canonical",
        "oembed-iframe",
        "video"
    ],

    // Dailymotion now requires Player ID that requires a partner account
    // https://developers.dailymotion.com/changelog/api-player-id-required-in-embed-urls
    // https://developers.dailymotion.com/docs/getting-started-with-the-web-sdk
    getLink: function (url, iframe, options) {
        const playerMatch = iframe.src?.match(/^https:\/\/geo\.dailymotion\.com\/player\/([a-zA-Z\-_]+)\.html/i)

        if (!playerMatch) {
            const playerId = options.getRequestOptions('dailymotion.player');
            if (playerId) {
                console.log(21, iframe.src.replace(/\/player\.html/i, `/player/${playerId}.html`))
                iframe.src = iframe.src.replace(/\/player\.html/i, `/player/${playerId}.html`);
                console.log(22, iframe.src)
            } else {
                return {
                    message: 'Dailymotion now requires partner player ID https://developers.dailymotion.com/changelog/api-player-id-required-in-embed-urls'
                }
            }
        }
        
        if (iframe.src && iframe.height) {
            var player = {
                href: iframe.src,
                type: CONFIG.T.text_html,
                "rel": [CONFIG.R.player, CONFIG.R.autoplay, CONFIG.R.oembed],
                "aspect-ratio": iframe.width / iframe.height,
                autoplay: "mute=false"
            };

            // Do not replace direct link to custom players
            if (options.redirectsHistory
                && /^https?:\/\/(?:geo\.)?dailymotion\.com\/player\/[a-zA-Z0-9]+\.html\?video=([a-zA-Z0-9]+)/i.test(options.redirectsHistory[0])) {
                player.href = options.redirectsHistory[0];
                player.rel = player.rel.filter(value => value !== 'autoplay');
            }

            return player;
        }
    },

    /**
     * Age-restrictred videos have a redirect to age confirmation page. 
     * To make it work, retrieved oembed first, 
     * then disable core restart of processing when there's a HTTP redirect.
     * Disable age-restricted, if `no_nsfw` is configured.
     */
    getData: function (oembed, options) {
        if (!options.getProviderOptions('no_nsfw', false)) {
            options.followHTTPRedirect = true;
        }
    },

    /* Tests will fail without Player ID
    tests: [{
        getUrls: function(cb) {
            got('https://api.dailymotion.com/videos', { responseType: 'json' })
            .then(response => {
                const data = response.body;
                if (!data || !data.list) {
                    return cb('No videos list in API data');
                }
                cb(null, data.list.slice(0, 10).map(function(item) {
                    return 'https://www.dailymotion.com/video/' + item.id;
                }));
            })
            .catch(error => cb(error));
        }
    }, {
        skipMixins: ["video", "og-description", "og-image", "canonical", "oembed-thumbnail"],
        skipMethods: ["getData"]
    },
        "https://www.dailymotion.com/video/x10bix2_ircam-mani-feste-2013-du-29-mai-au-30-juin-2013_creation",
        "https://www.dailymotion.com/swf/video/xcv6dv_pixels-by-patrick-jean_creation",
        "https://www.dailymotion.com/embed/video/xcv6dv_pixels-by-patrick-jean_creation",
        "https://dailymotion.com/embed/video/x5yiamz?queue-enable=false"
    ]
    */
};