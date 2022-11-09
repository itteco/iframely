// https://support.office.com/en-gb/article/View-Office-documents-online-1cc2ea26-0f7b-41f7-8e0e-6461a104544e?ui=en-US&rs=en-GB&ad=GB

export default {

    getLink: function(url, __nonHtmlContentData, options) {

        if (!options.getProviderOptions('disableDocViewers', false)
            && /application\/vnd\.openxmlformats\-officedocument|ms\-powerpoint|msword|ms\-excel|ms\-office/.test(__nonHtmlContentData.type)
            && (!__nonHtmlContentData.content_length || __nonHtmlContentData.content_length < 10 * 1024 * 1024)
            ) {

            var result = {
                href: "https://view.officeapps.live.com/op/embed.aspx?src=" + encodeURIComponent(url),
                type: CONFIG.T.text_html,
                rel: [CONFIG.R.reader, CONFIG.R.file],
                "aspect-ratio": /presentation|ms\-powerpoint|ms\-excel|ms\-office/i.test(__nonHtmlContentData.type) ?  4/3 : CONFIG.DOC_ASPECT_RATIO
            }

            if (/^https?:\/\/[a-zA-Z0-9\-\_]+\.googleapis\.com\//i.test(url) || options.getProviderOptions('disableMSDocViewer', false)) {
                result.href = "https://docs.google.com/viewer?embedded=true&url=" + encodeURIComponent(url);
                result.message = "MS Office viewer is disabled for that URL. Falling back to Google Docs viewer."
            } else if (/presentation|ms\-powerpoint/i.test(__nonHtmlContentData.type)) {
                result['padding-bottom'] = 23;
            }

            return result;
        } 
        
        // `__nonHtmlContentData['set-cookie']` message used to be 'File server sets cookie and is not supported'
        // But it doesn't seem to be relevant any longer as of Jan 7, 2022
        if (/application\/vnd\.openxmlformats\-officedocument|ms\-powerpoint|msword|ms\-excel|ms\-office/.test(__nonHtmlContentData.type) 
            && __nonHtmlContentData.content_length > 10 * 1024 * 1024) {
            return {
                message: 'Office file is bigger than 10Mb and is not supported'
            }
        }

        if (options.getProviderOptions('disableDocViewers', false) 
            && /application\/vnd\.openxmlformats\-officedocument|ms\-powerpoint|msword|ms\-excel|ms\-office/.test(__nonHtmlContentData.type)) {
            return {
                message: 'Office files are not supported per your media settings'
            }
        }
    }
};