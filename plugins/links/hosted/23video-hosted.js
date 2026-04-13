export default {

    provides: ["oembed_domain"],

    // linked to oembed, so won't run for all URLs
    getData: function(meta, oembed, iframe, whitelistRecord) {

        if (whitelistRecord.isDefault
            && oembed.type == 'video'
            && /\/v\.ihtml(?:\/player\.html)?/i.test(iframe.src)
            && ((meta.em && meta.em.schema == '23video') || /^twentythree$/i.test(oembed.provider_name))) {

            return {
                oembed_domain: "twentythree.com"
            }
        }
    },

    tests: [
        "https://video.itu.dk/live/13796543",
        "https://video.ku.dk/video/11827941/visual-social-media-lab-farida-vis-anne",
        "https://video.nextconf.eu/video/1880845/data-without-limits",
        "https://www.fftv.no/skipatruljen-s3e3-voss-resort",
    ]
};