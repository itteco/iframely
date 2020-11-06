module.exports = {

    mixins: [
        "oembed-thumbnail",
        "oembed-author",
        "oembed-site",
        "oembed-title"
    ],

    getLink: function(oembed, whitelistRecord) {

        var iframe = oembed.getIframe();

        if (iframe && whitelistRecord.isAllowed && whitelistRecord.isAllowed('oembed.video', 'autoplay')) {

            var href = iframe.src;

            var links = [{
                href: href + (href.indexOf('?') > -1 ? '&' : '?') + 'autoplay=0',
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.player, CONFIG.R.oembed, CONFIG.R.html5],
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
