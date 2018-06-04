module.exports = {

    prepareLink: function(link) {

        // Add 'responsive' tag for html5 videos.

        if (link.rel.indexOf('responsive') === -1 && link.type) {

            if (link.type.indexOf('video/') === 0
                || link.type === CONFIG.T.stream_apple_mpegurl
                || link.type === CONFIG.T.stream_x_mpegurl) {

                link.rel.push('responsive');
            }
        }
    }
};