import * as urlLib from 'url';
import * as utils from '../../../utils.js';
import { cache } from '../../../cache.js';

export default {

    startIteration: function(iterationPluginContext) {
        iterationPluginContext.multiCache = new cache.MultiCache();
    },

    finishIteration: function(iterationPluginContext) {
        iterationPluginContext.multiCache.runAllGets();
    },

    prepareLink: function(url, link, options, iterationPluginContext, cb) {

        // Check if need link processing.
        if (!link.href) {
            return cb();
        }

        if (link._imageStatus && link._imageStatus.doNotCheck) {
            return cb();
        }

        if (/* options.getProviderOptions('images.checkFavicon') === false */
            CONFIG.providerOptions && CONFIG.providerOptions.images
            && CONFIG.providerOptions.images.checkFavicon === false
            ) {
            return cb();
        }

        var match =
            // Check link type.
            (/^image/.test(link.type))
            // Check if favicon or svg. 
            && (link.type === CONFIG.T.image_svg || link.rel.indexOf(CONFIG.R.icon) > -1);

        if (!match) {
            return cb();
        }

        // do not allow data:image
        if (/^data:/i.test(link.href)) {
            link.error = "Data images not supported";
            return cb();
        }

        // do not allow svg icons if disabled
        if (link.type === CONFIG.T.image_svg && !options.getProviderOptions('images.svg', true)) {
            link.error = "SVG images are not allowed via `image.svg` option";
            return cb();
        }        

        // Start link processing.

        var uri = link.href;

        var forceSyncCheck = options.forceSyncCheck || (link._imageStatus && link._imageStatus.forceSyncCheck);

        if (!forceSyncCheck) {
            options = {...{doNotWaitFunctionIfNoCache: true}, ...options};
        }

        utils.getUriStatus(uri, {...options, ...{multiCache: iterationPluginContext.multiCache}}, function(error, data) {

            error = error || (data && data.error);

            if (error) {
                // Unknown error.
                link.error = error;
            } else if (data) {

                if (data.code != 200) {
                    // Image not found or other error. Exclude link from results.                    
                    link.error = data.code;
                } else if (!/^image|application\/octet\-stream/.test(data.content_type)) {
                    if (data.content_type) { // see rapgenius/cloudflare
                        link.error = "Non-image MIME type: '" + data.content_type + "'";
                    }
                }
                
                if (data.code == 200 && data.content_length === 0) {
                    link.error = "Image with 0 content_length";
                }

            }

            // Store timing.
            if (options.debug && data && data._time) {
                link._imageStatus = {time: data._time};
            }

            cb();
        });
    }

};