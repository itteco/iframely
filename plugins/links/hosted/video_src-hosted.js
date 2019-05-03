module.exports = {

    provides: 'video_src',

    getData: function(url, meta, whitelistRecord) {
        
        // do not process if there is a whitelist record for this domain as processing will take longer
        if (meta.twitter && (whitelistRecord.isDefault || (whitelistRecord.isAllowed && !whitelistRecord.isAllowed('twitter.player')))) {

            var video_src = (meta.twitter.player && meta.twitter.player.value) || meta.twitter.player;
            if (video_src && typeof video_src === "string" 
                && CONFIG.KNOWN_VIDEO_SOURCES.test(video_src)
                && !CONFIG.KNOWN_VIDEO_SOURCES.test(url)) {

                return {
                    video_src: video_src
                };
            }
        }

        if (meta.og && meta.og.video && (whitelistRecord.isDefault || (whitelistRecord.isAllowed && !whitelistRecord.isAllowed('og.video')))) {
        
            var video = meta.og.video && (meta.og.video instanceof Array  && meta.og.video.length > 1 ? meta.og.video[1] : meta.og.video);
            var video_src = (video && (video.url || video.secure_url)) || (video && video.iframe) || video;

            if (video_src && !(video_src instanceof Array)
                && CONFIG.KNOWN_VIDEO_SOURCES.test(video_src)
                && !CONFIG.KNOWN_VIDEO_SOURCES.test(url)) {

                if (/^\/\//.test(video_src)) {
                    video_src = 'http:' + video_src;
                }
                return {
                    video_src: video_src
                };

            }
        }
    }

};