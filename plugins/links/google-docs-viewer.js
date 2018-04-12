module.exports = {

    getLink: function(url, __nonHtmlContentData) {

        if (/application\/pdf|text\/rtf/.test(__nonHtmlContentData.type) && __nonHtmlContentData.content_length < 10 * 1024 * 1024) {
            // Skip files that are over 10Mb, ex - http://topchoice.com.mt/pdf/TOPCHOICE-AD.pdf 
            // (Though Google seems to have the limit of 25Mb - that is still too much for general Iframley use)
            return {
                href: "https://docs.google.com/viewer?embedded=true&url=" + encodeURIComponent(url),
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.reader, CONFIG.R.file, CONFIG.R.ssl, CONFIG.R.html5],
                "aspect-ratio": 1 / Math.sqrt(2) // standard sqrt(2) aspect for A4 and other standard A* format papers (except North America, of course)
            }
        }
    }
};