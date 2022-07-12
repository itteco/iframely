export default {

    mixins: [
        "oembed-thumbnail",
        "oembed-author",
        "oembed-site",
        "oembed-title",
        "oembed-iframe"
    ],

    getLink: function(iframe, oembed, whitelistRecord) {

        if (iframe.src && whitelistRecord.isAllowed && whitelistRecord.isAllowed('oembed.video', 'autoplay')) {

            var links = [{
                href: iframe.replaceQuerystring({autoplay:0}),
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.oembed],
                autoplay: "autoplay=1",
                'aspect-ratio': oembed.width / oembed.height
            }];

            if (/\/upload\/[^\/]+\/v(\d+)/i.test(oembed.thumbnail_url)) {
                links.push({
                    href: oembed.thumbnail_url.replace(/\/upload\/[^\/]+\/v(\d+)/i, '/upload/v$1'),
                    type: CONFIG.T.image,
                    rel: CONFIG.R.thumbnail
                });
            }

            return links;            
        }
    },

    tests: [
        "https://player.cnevids.com/embed/5670377e94c05f43e9000000/51097beb8ef9aff9f5000008",
        "http://player-backend.cnevids.com/iframe/video/54c5640161646d294c080000"
    ]
};
