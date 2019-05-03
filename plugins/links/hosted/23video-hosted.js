var cheerio = require('cheerio');

module.exports = {

    // linked to oembed, so won't run for all URLs
    getLink: function(meta, oembed, whitelistRecord) {

        if (whitelistRecord.isDefault
            && oembed.type == 'video' && oembed.width && oembed.height
            && ((meta.em && meta.em.schema == '23video') || oembed.provider_name == 'TwentyThree')) {

            var players = [];

            if (meta.video_src
                && /https?:\/\/[^.]+\.23video\.com\/\d+\/\d+\/\w+\/[^\?]+\.mp4/i.test(meta.video_src)) {

                players.push({
                    href: meta.video_src,
                    type: CONFIG.T.video_mp4,
                    rel: [CONFIG.R.player, CONFIG.R.html5],
                    'aspect-ratio': oembed.width / oembed.height
                });
            }

            var $container = cheerio('<div>');
            try {
                $container.html(oembed.html);
            } catch (ex) {}

            var $iframe = $container.find('iframe');

            if ($iframe.length == 1 && /\/v\.ihtml(?:\/player\.html)?/i.test($iframe.attr('src'))) {

                players.push({
                    href: $iframe.attr('src'),                    
                    type: CONFIG.T.text_html,
                    rel: [CONFIG.R.player, CONFIG.R.html5],
                    'aspect-ratio': oembed.width / oembed.height,
                    autoplay: 'autoPlay=1'
                });

            }

            return players;
        }
    }

    /*
    http://video.itu.dk/live/13796543
    http://video.ku.dk/visual-social-media-lab-farida-vis-anne
    https://video.twentythree.net/intro-to-twentythrees-player-builder
    http://videos.liftconference.com/video/3310088?source=share

    http://videos.theconference.se/paul-adams-solving-real-world-problems
    http://www.fftv.no/skipatruljen-s3e3-voss-resort
    https://videos.23video.com/novo-nordisk
    http://video.nextconf.eu/video/1880845/data-without-limits
    http://stream.umbraco.org/v.ihtml?source=share&photo%5fid=11665495&autoPlay=0
    */
};