export default {

    getLink: function(oembed, whitelistRecord, url) {

        if ((oembed.type === "photo" || /^image/i.test(oembed.type)) && oembed.url && whitelistRecord.isAllowed && whitelistRecord.isAllowed('oembed.photo')) {

            return {
                href: oembed.url,
                type: CONFIG.T.image,
                rel: [CONFIG.R.image, CONFIG.R.oembed],
                width: oembed.width,
                height: oembed.height
            };
            
        }
    }
};