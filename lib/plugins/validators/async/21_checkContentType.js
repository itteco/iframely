var utils = require('../../../utils');
var urlLib = require('url');
var responsiveHtml5Plugin = require('../responsive_html5');
var mediaPlugin = require('../media');

module.exports = {

    prepareLink: function(url, link, options, pluginContext, cb) {

        // Check if need link processing.

        function finish() {

            delete link.accept;

            if (!link.type && !link.error) {
                link.error = 'Could not validate link MIME type';
            }

            // Async fallback to 10_video_html.js
            if ((/^video|audio\//i.test(link.type) || link.type === CONFIG.T.stream_x_mpegurl || link.type === CONFIG.T.stream_apple_mpegurl) && link.rel.indexOf(CONFIG.R.html5) === -1) {
                link.rel.push(CONFIG.R.html5);
            }

            if (/^audio\//i.test(link.type)) {
                link.rel.push(CONFIG.R.audio);
            }

            cb();
        }

        if (!link.href || !(link.type == CONFIG.T.flash || link.accept)) {
            return finish();
        }

        // Need this for // case (no protocol).
        var uri = urlLib.resolve(url, link.href);

        // Remove get params.
        var uriForCache = uri.replace(/\?.*$/i, '');

        // Detect swf extension in url as flash, support old checkFlash logic
        if (uriForCache.match(/\.swf$/i) && (link.type == CONFIG.T.flash || link.accept.indexOf(CONFIG.T.flash) > -1 )) {
            link.type = CONFIG.T.flash;
            return finish();
        }

        // Detect mp4 extension in url, support old checkFlash logic
        if (uriForCache.match(/\.mp4$/i) && link.accept.indexOf(CONFIG.T.flash) > -1)  {
            link.type = CONFIG.T.video_mp4;
            return finish();
        }

        // Detect html extension in url as html.
        if (uriForCache.match(/\.html$/i) && link.accept.indexOf(CONFIG.T.flash) > -1) {
            link.type = CONFIG.T.text_html;
            return finish();
        }

        function setLinkType(link, error, data) {

            var error = error || (data && data.error);

            if (error) {
                // Unknown error.
                link.error = error;
            } else if (data.code && data.code != 200) {
                // URI not found or other error. Exclude link from results.
                link.error = data.code;
            } else {

                if (data.type ==  'application/xhtml+xml' || data.type == 'text/plain') {
                    data.type = CONFIG.T.text_html;
                }

                if (data.type == CONFIG.T.text_html && data.x_frame_options && /^sameorigin|deny$/i.test(data.x_frame_options)) {
                    link.error = 'iFrame removed due to x-frame-options header';
                }

                if (data.type == CONFIG.T.text_html) {
                    var m = data.csp && data.csp.match && data.csp.match(/frame-ancestors:?([^;]+);?/i);
                    var frame_ancestors = m && m[1];

                    if (frame_ancestors) { // allow only if it contains " * "
                        frame_ancestors = frame_ancestors.replace(/^\*/i, ' *');
                        frame_ancestors = frame_ancestors.replace(/\*$/i, '* ');
                        if (frame_ancestors.indexOf(' * ') == -1) {
                            link.error = 'iFrame removed due to frame-ancestors content security policy';
                        }
                    }
                }


                if (data.type == CONFIG.T.video_mp4 && !/bytes/i.test(data.accept_ranges)) {
                    link.error = 'MP4s should allow partial download via accept ranges';
                }                

                if ((data.type == CONFIG.T.stream_apple_mpegurl || data.type == CONFIG.T.stream_x_mpegurl) && data.allow_origin !== '*') {
                    link.error = 'CORS headers on the player are not configured correctly';
                }

                if (link.accept && link.accept instanceof Array && !(link.accept.indexOf(data.type) > -1 || data.type && link.accept.indexOf(data.type.replace(/\/.+$/i, '/*')) > -1) ) {
                    link.error = data.type + ' is not an expected type (' + link.accept.join(',') + ')';
                }

            }

            // Store timing.
            if (options.debug && data && data._time) {
                link._checkContentType = {time: data._time};
            }

            if (data && data.type) {
                link.type = data.type;
            }

            responsiveHtml5Plugin.prepareLink(link, options);
            mediaPlugin.prepareLink(link, options);
        }

        var uriForCacheCallbacksDict = pluginContext.uriForCacheDict = pluginContext.uriForCacheDict || {};

        if (uriForCache in uriForCacheCallbacksDict) {

            // Wait for other.

            uriForCacheCallbacksDict[uriForCache].push(function(error, data) {

                setLinkType(link, error, data);

                finish();
            });

        } else {

            // Load from net.

            uriForCacheCallbacksDict[uriForCache] = [];

            utils.getContentType(uriForCache, uri, options, function(error, data) {

                setLinkType(link, error, data);

                finish();

                var j, callbacks = uriForCacheCallbacksDict[uriForCache];
                for(j = 0; j < callbacks.length; j++) {
                    callbacks[j](error, data);
                }

                delete uriForCacheCallbacksDict[uriForCache];
            });
        }
    }
};