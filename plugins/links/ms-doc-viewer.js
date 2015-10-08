module.exports = {

    getLink: function(url, __nonHtmlContentData) {

        if (/application\/vnd\.openxmlformats\-officedocument|ms\-powerpoint|msword|ms\-excel|ms\-office/.test(__nonHtmlContentData.type)) {
            return {
                href: "https://view.officeapps.live.com/op/embed.aspx?src=" + encodeURIComponent(url),
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.reader, CONFIG.R.file, CONFIG.R.ssl, CONFIG.R.HTML5],
                "aspect-ratio": /presentation|ms\-powerpoint|ms\-excel|ms\-office/.test(__nonHtmlContentData.type) ?  4/3 : 1 / Math.sqrt(2)
            }
        }
    }
};