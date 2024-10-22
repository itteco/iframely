import log from '../../../../logging.js';

export default {

    provides: [
        // Run for all who requests htmlparser or meta.
        'htmlparser',
        'meta'
    ],

    getLink: function(url, __nonHtmlContentData, options, cb) {
        var nonHtmlContentType = __nonHtmlContentData.type;
        var nonHtmlContentLength = __nonHtmlContentData.content_length;

        // HEADS UP: do not ever remove the below check for 'javascript' or 'flash' in content type
        // if left allowed, it'll make apps vulnerable for XSS attacks as such files will be rendered as regular embeds
        if (/javascript|flash|application\/json|text\/xml|application\/xml/i.test(nonHtmlContentType)) {
            log('   -- Non html content type: "' + nonHtmlContentType + '" for ' + url);
            return cb({
                responseStatusCode: 415
            });
        } else {
            return cb(null, {
                // link to original file URL to keep up with location changes (e.g. MP4)
                href: /video\//i.test(nonHtmlContentType) && options.redirectsHistory ? options.redirectsHistory[0] : url,
                type: nonHtmlContentType.replace(/;.*$/i, ''), // Clean up codes from types like "video/mp4;codecs=avc1" - example: clourdinary,
                content_length: parseInt(nonHtmlContentLength, 10),
                rel: CONFIG.R.file
                // client-side iframely.js will also properly render video/mp4 and image files this way
            });
        }
    }

};
