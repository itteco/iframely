module.exports = {

    getLink: function(oembed, whitelistRecord) {

        if ((oembed.type === "photo" || oembed.type === "image") && oembed.url && whitelistRecord.isAllowed && whitelistRecord.isAllowed('oembed.photo')) {

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