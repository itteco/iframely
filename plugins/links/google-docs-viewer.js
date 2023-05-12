export default {

    getLink: function(url, __nonHtmlContentData, utils, headers, options, iframelyRun, cb) {

        if (!options.getProviderOptions('disableDocViewers', false) &&
            /application\/pdf|text\/rtf/.test(__nonHtmlContentData.type)) {

            if (__nonHtmlContentData.content_length < 10 * 1024 * 1024) {
                // Skip files that are over 10Mb, 
                // ex - http://topchoice.com.mt/pdf/TOPCHOICE-AD.pdf 
                // ex - http://zwinnalodz.eu/wp-content/uploads/2016/02/The-Lean-Startup-.pdf
                // (Though Google seems to have the limit of 25Mb - that is still too much for general Iframely use)

                var src = "https://docs.google.com/viewer?embedded=true&url=" + encodeURIComponent(url);

                // Warm up Google's cache
                utils.getContentType(src, src, options, function(error, data) {
                });

                return cb(null, {
                    href: src,
                    type: CONFIG.T.text_html,
                    rel: [CONFIG.R.reader, CONFIG.R.file],
                    "aspect-ratio": CONFIG.DOC_ASPECT_RATIO
                })

            // Amazon S3-powered CloudFront distributions sometimes don't have `content_length` on cache miss,
            // `accept-encoding: identity` fixes that
            } else if (typeof __nonHtmlContentData.content_length === 'undefined'
                && headers.server === "AmazonS3"
                && options.stopRecursion !== true) {

                var options2 = {...options, ...{
                    proxy: {
                        headers: {
                            "Accept-Encoding": "identity"
                        }
                    },
                    debug: false,
                    stopRecursion: true, // avoid infinite recursion in processing
                    refresh: true // avoid using cached version with no content-length header
                }};

                iframelyRun(url, options2, function(error, data) {
                    if (!data || !data.links) {
                        return cb({
                            message: "This AmazonS3 bucket does not provide content-length, needed for PDF validation"
                        });
                    } else {
                        return cb(error || data.messages && {message: data.messages[0]}, data.links);
                    }
                });

            } else {
                return cb(null, {
                    message: 'PDF files that are over 10Mb are not supported by Google Docs Viewer'
                })
            }
        } else if (/application\/pdf|text\/rtf/.test(__nonHtmlContentData.type)) {
            return cb(null, {
                message: 'PDFs are not supported per your media settings'
            })
        }
    }
};