module.exports = {

    getLink: function(url, __nonHtmlContentData, options) {

        if (!options.getProviderOptions('disableDocViewers', false) &&
            /application\/pdf|text\/rtf/.test(__nonHtmlContentData.type)) {

            if (__nonHtmlContentData.content_length < 10 * 1024 * 1024) {
                // Skip files that are over 10Mb, 
                // ex - http://topchoice.com.mt/pdf/TOPCHOICE-AD.pdf 
                // ex - http://zwinnalodz.eu/wp-content/uploads/2016/02/The-Lean-Startup-.pdf
                // (Though Google seems to have the limit of 25Mb - that is still too much for general Iframely use)

                return {
                    href: "https://docs.google.com/viewer?embedded=true&url=" + encodeURIComponent(url),
                    type: CONFIG.T.text_html,
                    rel: [CONFIG.R.reader, CONFIG.R.file, CONFIG.R.ssl, CONFIG.R.html5],
                    "aspect-ratio": 1 / Math.sqrt(2) // standard sqrt(2) aspect for A4 and other standard A* format papers (except North America, of course)
                }

            } else {
                return {
                    message: 'PDF files that are over 10Mb are not supported'
                }
            }
        }
    }
};