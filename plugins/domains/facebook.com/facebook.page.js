export default {

    re: [
        /^https?:\/\/(www|m)\.facebook\.com\/([^\/\?]+(?<!\.php))\/?(?:about|photos|videos|events|timeline|photos_stream)?\/?(?:\?[^\/\?]+)?$/i,
        /^https?:\/\/(www|m)\.facebook\.com\/(?:pg|pages)\//i,
        /^https?:\/\/(www|m)\.facebook\.com\/people\/[^\/]+\/\d+/i // for the "N/A" message only
    ],

    getData: function(options, cb) {

        // https://developers.facebook.com/blog/post/2025/04/08/oembed-updates/
        const msg = 'Facebook has retired automated page embeds on November 3, 2025.';
        
        if (options.getProviderOptions('facebook.thumbnail', true)) {
            return cb({
                message: msg
                // and fall back to generic
            });
        } else {
            return cb({
                responseStatusCode: 415,
                message: msg
                // and do not fall back to generic
            });
        }
    }

    // "https://www.facebook.com/facebook",
    // "https://www.facebook.com/hlaskyjanalasaka?fref=nf",
    // "https://www.facebook.com/pages/Art-Friend-the-Curve/199296263568281", // unowned
    // "https://www.facebook.com/RhulFencing/",
    // "https://www.facebook.com/caboreytours/"
};