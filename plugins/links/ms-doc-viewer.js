// https://support.office.com/en-gb/article/View-Office-documents-online-1cc2ea26-0f7b-41f7-8e0e-6461a104544e?ui=en-US&rs=en-GB&ad=GB

module.exports = {

    getLink: function(url, __nonHtmlContentData, options) {

        if (!options.getProviderOptions('disableDocViewers', false)
            && /application\/vnd\.openxmlformats\-officedocument|ms\-powerpoint|msword|ms\-excel|ms\-office/.test(__nonHtmlContentData.type)
            && (!__nonHtmlContentData.content_length || __nonHtmlContentData.content_length < 10 * 1024 * 1024)
            &&  !__nonHtmlContentData['set-cookie']) {
            return {
                href: "https://view.officeapps.live.com/op/embed.aspx?src=" + encodeURIComponent(url),
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.reader, CONFIG.R.file, CONFIG.R.ssl, CONFIG.R.html5],
                "aspect-ratio": /presentation|ms\-powerpoint|ms\-excel|ms\-office/.test(__nonHtmlContentData.type) ?  4/3 : 1 / Math.sqrt(2)
            }
        } 
        // checked if viewer could not be used
        if (/application\/vnd\.openxmlformats\-officedocument|ms\-powerpoint|msword|ms\-excel|ms\-office/.test(__nonHtmlContentData.type) 
            && (__nonHtmlContentData.content_length > 10 * 1024 * 1024 || __nonHtmlContentData['set-cookie'])) {
            return {
                message: __nonHtmlContentData.content_length > 10 * 1024 * 1024 ? 'Office file is bigger than 10Mb and is not supported' : 'File server sets cookie and is not supported'
            }
        }
    }
};