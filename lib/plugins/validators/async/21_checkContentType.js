const utils = require('../../../utils');
const urlLib = require('url');
const multimedia = require('../html5_multimedia');
const mediaPlugin = require('../media');
const player_no_scrolling = require('../player_no_scrolling');

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

            multimedia.prepareLink(link, options);
            mediaPlugin.prepareLink(link, options);
            player_no_scrolling.prepareLink(link, options);

            cb();
        }

        if (!link.href || !(link.type == CONFIG.T.flash || link.accept)) {
            return finish();
        }

        // Need this for // case (no protocol).
        var uri;
        if (/^https?:\/\//i.test(link.href)) { // regular hrefs
            uri = link.href;
        } else if (/^\/\//i.test(link.href) && // protocol-less iFrames
            (link.type === CONFIG.T.text_html 
                || (link.accept && link.accept.indexOf && link.accept.indexOf(CONFIG.T.text_html) >-1 ))) {
            uri = "https:" + link.href; // we'll validate against https
        } else { // relative paths or other mime types will resolve to http
            uri = urlLib.resolve(url, link.href);
        }

        // Remove get params.
        var uriForCache = uri.replace(/\?.*$/i, '');

        // 'old checkFlash logic' works and expects the cases when video is in the domains whitelist

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

                /** accept-ranges is misconfigured in many cases (especially via CloudFront). Plus, browsers would try and download first range of MP4 file anyway, even if the header isn't set
                if (data.type == CONFIG.T.video_mp4 && !/bytes/i.test(data.accept_ranges)) {
                    console.log('data', data);
                    link.error = 'MP4s should allow partial download via accept ranges';
                } */

                if ((data.type == CONFIG.T.stream_apple_mpegurl || data.type == CONFIG.T.stream_x_mpegurl) && data.allow_origin !== '*') {
                    link.error = 'CORS headers on the player are not configured correctly';
                }

                if (link.accept && link.accept instanceof Array && !(link.accept.indexOf(data.type) > -1 || data.type && link.accept.indexOf(data.type.replace(/\/.+$/i, '/*')) > -1) ) {
                    link.error = data.type + ' is not an expected type (' + link.accept.join(',') + ')';
                }

                if (!link.error && data.type == CONFIG.T.text_html // check and don't allow https -> http redirects for iFrames
                    && data.href && /^(?:https:)?\/\//.test(link.href) && /^http:\/\//.test(data.href)) {                    
                    link.href = data.href;
                    if (link.rel && link.rel.indexOf('ssl') > -1) {
                        link.rel.splice(link.rel.indexOf('ssl'), 1);
                    }
                }

            }

            // Store timing.
            if (options.debug && data && data._time) {
                link._checkContentType = {time: data._time};
            }

            if (data && data.type) {
                if (CONFIG.TYPES.indexOf(data.type) > -1) {
                    link.type = data.type;
                } else if (!link.error) {
                    link.error = "Unsupported MIME type: " + data.type + ". Add to CONFIG.T to allow";
                }
            }
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