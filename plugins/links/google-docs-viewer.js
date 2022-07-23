import * as utils from '../../lib/utils.js';

export default {

    getLink: function(url, __nonHtmlContentData, options) {

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

                return {
                    href: src,
                    type: CONFIG.T.text_html,
                    rel: [CONFIG.R.reader, CONFIG.R.file],
                    "aspect-ratio": CONFIG.DOC_ASPECT_RATIO
                }

            } else {
                return {
                    message: 'PDF files that are over 10Mb are not supported by Google Docs Viewer'
                }
            }
        } else if (/application\/pdf|text\/rtf/.test(__nonHtmlContentData.type)) {
            return {
                message: 'PDFs are not supported per your media settings'
            }
        }
    }
};