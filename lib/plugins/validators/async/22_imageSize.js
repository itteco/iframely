import * as utils from '../../../utils.js';
import { cache } from '../../../cache.js';
import mediaPlugin from '../media.js';
import * as urlLib from 'url';


export default {

    startIteration: function(iterationPluginContext) {
        iterationPluginContext.multiCache = new cache.MultiCache();
    },

    finishIteration: function(iterationPluginContext) {
        iterationPluginContext.multiCache.runAllGets();
    },

    prepareLink: function(url, link, options, iterationPluginContext, cb) {

        if (!link.href) {
            return cb();
        }

        // Check if need link processing.

        // Check if disabled by config.
        if (/* options.getProviderOptions('images.loadSize') === false */
            CONFIG.providerOptions && CONFIG.providerOptions.images
            && CONFIG.providerOptions.images.loadSize === false
            || options.skipImageCheck) {
            return cb();
        }

        var media = link.media || {};

        var imageTypeMatch =
            // Check link type.
            (/^image/.test(link.type))
            // Skip svg - xml not parsed here.
            && (link.type !== CONFIG.T.image_svg)
            // Check if not favicon.
            && (link.rel.indexOf(CONFIG.R.icon) === -1 || link.rel.indexOf(CONFIG.R.iframely) > -1);

        if (!imageTypeMatch) {
            return cb();
        }

        if (/^https?:\/\/[^\/]+\/?https?:?\/\//.test(link.href)) { // ex.: https://hbr.org/1966/03/how-to-buysell-professional-services
            link.href = link.href.replace(/^https?:\/\/[^\/]+\/?https?:?\/\//, 'http://');
        }

        // Skip waiting data for image with width and height, but store to cache.
        var doNotWaitFunctionIfNoCache = media.width && media.height;

        // Start link processing.
        // `urlLib.resolve(url, link.href)` is done in 00_validateLink.js, except protocol-less hrefs
        var href = !/^\/\//.test(link.href) ? link.href : urlLib.resolve(url, link.href);

        utils.getImageMetadata(
            href, {
                ...options,
                multiCache: iterationPluginContext.multiCache,
                doNotWaitFunctionIfNoCache: doNotWaitFunctionIfNoCache
            },
            function(error, data) {

                if (link.href !== href) {
                    link.href = href;
                }

                error = error || (data && data.error);

                if (error) {

                    if (options.debug) {
                        link._imageMeta = {
                            error: "Load image error: " + error.toString()
                        };
                    }

                    if (error >= 400 || (typeof error === 'string' && /invalid/i.test(error))) {
                        // Image not found. Exclude link from results.
                        link.error = error;
                    }

                } else if (data) {

                    link._imageMeta = {
                        type: data.format,
                        width: data.width,
                        height: data.height
                    };

                    if (data.content_length) {
                        link.content_length = data.content_length;
                    }

                    // Special case: add rel image for image file with specific size.
                    if (link.rel.indexOf(CONFIG.R.image) === -1 && link.rel.indexOf(CONFIG.R.file) > -1 && data.width >= 100 && data.height >= 100) {
                        link.rel.push(CONFIG.R.image);
                    }

                    if (link.rel.indexOf(CONFIG.R.file) > -1 && data.width === 1 && data.height === 1) {
                        link.error = "Too small image file";
                    }

                    if (/webp/i.test(data.format)
                        && !options.getProviderOptions('images.webp', false)) {

                        link.error = "To turn on WebP images, configure images.disable_webp in providerOptions";
                    }

                    // Store timing.
                    if (options.debug && data && data._time) {
                        link._imageMeta = link._imageMeta || {};
                        link._imageMeta.time = data && data._time;
                    }

                    mediaPlugin.prepareLink(link, options);
                }

                cb();
            });
    }

};
