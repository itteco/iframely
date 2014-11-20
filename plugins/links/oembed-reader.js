module.exports = {

    notPlugin:  !(CONFIG.providerOptions.readability && CONFIG.providerOptions.readability.enabled === true),

    getLink: function(oembed, whitelistRecord) {

        if (oembed.type === "link" && oembed.html && whitelistRecord && whitelistRecord.isAllowed && whitelistRecord.isAllowed('oembed.link', "reader")) {
            
            return {
                html: oembed.html,
                type: CONFIG.T.safe_html,
                rel: [CONFIG.R.reader, CONFIG.R.inline]
            };
        }
    }
};