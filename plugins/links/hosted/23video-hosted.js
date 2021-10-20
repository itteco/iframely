export default {

    provides: ["oembed_domain"],

    // linked to oembed, so won't run for all URLs
    getData: function(meta, oembed, iframe, whitelistRecord) {

        if (whitelistRecord.isDefault
            && oembed.type == 'video'
            && /\/v\.ihtml(?:\/player\.html)?/i.test(iframe.src)
            && ((meta.em && meta.em.schema == '23video') || /^twentythree$/i.test(oembed.provider_name))) {

            return {
                oembed_domain: "23video.com"
            }
        }
    },

    tests: [
        "http://video.itu.dk/live/13796543",
        "http://video.ku.dk/visual-social-media-lab-farida-vis-anne",
        "https://video.twentythree.net/intro-to-twentythrees-player-builder",
        "http://videos.theconference.se/paul-adams-solving-real-world-problems",
        "http://www.fftv.no/skipatruljen-s3e3-voss-resort",
        // "https://videos.23video.com/novo-nordisk",
        "http://video.nextconf.eu/video/1880845/data-without-limits",
        "http://stream.umbraco.org/v.ihtml?source=share&photo%5fid=11665495&autoPlay=0"
    ]
};