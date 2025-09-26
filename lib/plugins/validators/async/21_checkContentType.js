import * as utils from '../../../utils.js';
import * as urlLib from 'url';
import multimedia from '../html5_multimedia.js';
import mediaPlugin from '../media.js';
import player_no_scrolling from '../player_no_scrolling.js';

export default {

    prepareLink: function(url, link, options, pluginContext, cb) {

        if (/^image/i.test(link.type) && !link.accept) {
            return cb();
        }

        function finish() {

            delete link.accept;

            if (!link.type && !link.error) {
                link.error = 'Could not validate link MIME type';
            }

            // Repeat required sync html5 validators
            if ((link.type === CONFIG.T.text_html || /^video|audio\//i.test(link.type) || link.type === CONFIG.T.stream_x_mpegurl || link.type === CONFIG.T.stream_apple_mpegurl) && link.rel.indexOf(CONFIG.R.html5) === -1) {
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

        if (!link.href || !link.accept) {
            return finish();
        }

        if (!Array.isArray(link.accept)) {
            link.accept = [link.accept];
        }

        // Need this for // case (no protocol).
        var uri;
        if (/^https?:\/\//i.test(link.href)) { // regular hrefs
            uri = link.href;
        } else if (/^\/\//i.test(link.href) && // protocol-less iFrames
            link.accept.indexOf(CONFIG.T.text_html) > -1) {
            uri = "https:" + link.href; // We'll validate against https
        } else { // relative paths or other mime types will resolve to http
            uri = urlLib.resolve(url, link.href);
        }

        // Remove GET params.
        var uriForCache = uri.replace(/\?.*$/i, '');

        // Do not fetch swf
        if (/\.swf$/i.test(uriForCache) && link.type == CONFIG.T.flash) {
            link.error = 'Adobe Flash Player is no longer supported';
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

                if (data.type && data.type.toLowerCase() === CONFIG.T.stream_x_mpegurl.toLowerCase()) {
                    data.type = CONFIG.T.stream_x_mpegurl; // This is to avoid checking ignore case later.
                }

                if (data.type == CONFIG.T.text_html && data.x_frame_options && /^sameorigin|deny$/i.test(data.x_frame_options)) {
                    link.error = 'iFrame removed due to x-frame-options header';
                }

                if (data.type == CONFIG.T.text_html) {
                    var m = data.csp && data.csp.match && data.csp.match(/frame-ancestors:?([^;]+);?/i);
                    var frame_ancestors = m && m[1];

                    if (frame_ancestors) { // allow only if it contains " * " or "http://*" or "https://*"
                        frame_ancestors = frame_ancestors.replace(/https?:\/\/\*/ig, '*'); // Ex. Behance video streams via Adobe CDN
                        frame_ancestors = frame_ancestors.replace(/^\*/i, ' *');
                        frame_ancestors = frame_ancestors.replace(/\*$/i, '* ');
                        if (frame_ancestors.indexOf(' * ') == -1) {
                            link.error = 'iFrame removed due to frame-ancestors content security policy';
                        }
                    }
                }

                if (data.type == CONFIG.T.flash) {
                    link.error = 'Adobe Flash Player is no longer supported';
                }

                if (data.type?.toLowerCase() == 'application/octet-stream' 
                    && link.rel?.indexOf(CONFIG.R.player) > -1
                    && link.accept && link.accept instanceof Array 
                    && link.accept.indexOf('video/*') > -1) {
                    data.type = CONFIG.T.video_mp4;
                    if (!link.message) {
                        link.message = 'Showing application/octet-stream as MP4';
                    }
                }                

                /** accept-ranges is misconfigured in many cases (especially via CloudFront). Plus, browsers would try and download first range of MP4 file anyway, even if the header isn't set
                if (data.type == CONFIG.T.video_mp4 && !/bytes/i.test(data.accept_ranges)) {
                    link.error = 'MP4s should allow partial download via accept ranges';
                } */

                if ((data.type == CONFIG.T.stream_apple_mpegurl || data.type == CONFIG.T.stream_x_mpegurl) 
                    && data.allow_origin !== '*' 
                    && (!data.request_origin && !data.allow_origin || data.allow_origin.indexOf(data.request_origin) == -1)) {
                    link.error = 'CORS headers on the player are not configured correctly';
                }

                if (link.accept && link.accept instanceof Array && !(link.accept.indexOf(data.type) > -1 || data.type && link.accept.indexOf(data.type.replace(/\/.+$/i, '/*')) > -1) ) {
                    link.error = data.type + ' is not an expected type (' + link.accept.join(',') + ')';
                }

                if (!link.error && data.url !== link.href) {

                    // We'll use _url in the core to validate href against redirects to canonical
                    link._uri = data.url;

                    // Catch https -> http redirects for iFrames
                    if (/^(?:https:)?\/\//.test(link.href) && /^http:\/\//.test(data.url)) {
                        link.href = data.url;
                        if (link.rel && link.rel.indexOf(CONFIG.R.ssl) > -1) {
                            link.rel.splice(link.rel.indexOf(CONFIG.R.ssl), 1);
                        }
                    // And vice versa, upgrade to HTTPs on redirect from HTTP
                    } else if (/^https:\/\//.test(data.url) && /^http:\/\//.test(link.href)) {
                        link.href = data.url;
                        if (link.rel && link.rel.indexOf(CONFIG.R.ssl) === -1) {
                            link.rel.push(CONFIG.R.ssl);
                        }
                    }
                }

            }

            // Store timing.
            if (options.debug && data && data._time) {
                link._checkContentType = {time: data._time, data: data};
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

            // Load from the Internet.

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