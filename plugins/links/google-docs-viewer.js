module.exports = {

    getLink: function(url, __nonHtmlContentData) {

        if (/application\/pdf|text\/rtf/.test(__nonHtmlContentData.type)) {
            return {
                href: "https://docs.google.com/viewer?embedded=true&url=" + encodeURIComponent(url),
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.reader, CONFIG.R.file, CONFIG.R.ssl, CONFIG.R.HTML5],
                "aspect-ratio": 1 / Math.sqrt(2) // standard sqrt(2) aspect for A4 and other standard A* format papers (except North America, of course)
            }
        }
    }
};